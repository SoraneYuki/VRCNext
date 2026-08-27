using System.Net.Http;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using Newtonsoft.Json.Linq;

namespace VRCNext.Services;

public sealed class PulsoidService : IDisposable
{
    private const string WsBase = "wss://dev.pulsoid.net/api/v1/data/real_time";
    private const string DeviceAuthUrl = "https://pulsoid.net/oauth2/device_authorization";
    private const string TokenUrl      = "https://pulsoid.net/oauth2/token";
    private const string Scope         = "data:heart_rate:read";
    public  const string ClientId      = "1263da74-f0fa-4122-abe1-dc6aee56678e";
    private const int StaleSeconds = 60;
    private const int MaxBackoffSec = 60;

    private readonly Action<string> _log;
    private CancellationTokenSource? _cts;
    private bool _running;
    private string _token = "";

    public int  CurrentBpm   { get; private set; }
    public bool IsConnected  { get; private set; }
    public string LastError  { get; private set; } = "";
    private DateTime _lastBeatUtc = DateTime.MinValue;

    public event Action? StateChanged;

    public PulsoidService(Action<string> log) => _log = log;

    public bool HasFreshData => CurrentBpm > 0 && (DateTime.UtcNow - _lastBeatUtc).TotalSeconds <= StaleSeconds;

    public void Start(string token)
    {
        token = (token ?? "").Trim();
        if (_running && token == _token) return;
        Stop();
        if (string.IsNullOrEmpty(token)) return;

        _token   = token;
        _running = true;
        _cts     = new CancellationTokenSource();
        LastError = "";
        _ = ConnectLoopAsync(_cts.Token);
    }

    public void Stop()
    {
        _running = false;
        try { _cts?.Cancel(); } catch { }
        _cts?.Dispose();
        _cts = null;
        if (IsConnected || CurrentBpm != 0)
        {
            IsConnected = false;
            CurrentBpm  = 0;
            _lastBeatUtc = DateTime.MinValue;
            StateChanged?.Invoke();
        }
    }

    private async Task ConnectLoopAsync(CancellationToken ct)
    {
        int delaySec = 1;

        while (_running && !ct.IsCancellationRequested)
        {
            using var ws = new ClientWebSocket();
            try
            {
                ws.Options.SetRequestHeader("Authorization", "Bearer " + _token);
                await ws.ConnectAsync(new Uri(WsBase), ct);
                _log("[Pulsoid] Connected");
                IsConnected = true;
                LastError   = "";
                StateChanged?.Invoke();
                delaySec = 1;

                await ReceiveLoopAsync(ws, ct);
            }
            catch (OperationCanceledException) { break; }
            catch (Exception ex)
            {
                LastError = ex.Message;
                _log($"[Pulsoid] Connect error: {ex.Message}");
            }

            if (IsConnected)
            {
                IsConnected = false;
                StateChanged?.Invoke();
            }
            if (!_running || ct.IsCancellationRequested) break;

            try { await Task.Delay(TimeSpan.FromSeconds(delaySec), ct); }
            catch (OperationCanceledException) { break; }
            delaySec = Math.Min(delaySec * 2, MaxBackoffSec);
        }
    }

    private async Task ReceiveLoopAsync(ClientWebSocket ws, CancellationToken ct)
    {
        var buf = new byte[4096];
        var sb  = new StringBuilder();

        while (!ct.IsCancellationRequested && ws.State == WebSocketState.Open)
        {
            WebSocketReceiveResult res;
            try { res = await ws.ReceiveAsync(new ArraySegment<byte>(buf), ct); }
            catch (OperationCanceledException) { return; }
            catch (Exception ex) { LastError = ex.Message; return; }

            if (res.MessageType == WebSocketMessageType.Close) return;

            sb.Append(Encoding.UTF8.GetString(buf, 0, res.Count));
            if (!res.EndOfMessage) continue;

            var payload = sb.ToString();
            sb.Clear();
            HandleMessage(payload);
        }
    }

    private void HandleMessage(string payload)
    {
        if (string.IsNullOrWhiteSpace(payload)) return;
        try
        {
            var bpm = JObject.Parse(payload)["data"]?["heart_rate"]?.Value<int>() ?? 0;
            if (bpm <= 0) return;
            var changed = bpm != CurrentBpm;
            CurrentBpm   = bpm;
            _lastBeatUtc = DateTime.UtcNow;
            if (changed) StateChanged?.Invoke();
        }
        catch (Exception ex) { _log($"[Pulsoid] Parse error: {ex.Message}"); }
    }

    /// <summary>
    /// OAuth2 Device Authorization Flow. Free for the end user, unlike a manually issued token
    /// which needs a paid Pulsoid plan. Opens the consent page and polls until the user grants access.
    /// </summary>
    public async Task<(bool ok, string token, string error)> LinkAccountAsync(
        string clientId, Action<string> openUrl, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(clientId)) return (false, "", "no_client_id");
        try
        {
            using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(20) };

            var startBody = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["client_id"] = clientId,
                ["scope"]     = Scope,
            });
            var startResp = await http.PostAsync(DeviceAuthUrl, startBody, ct);
            var startJson = await startResp.Content.ReadAsStringAsync(ct);
            if (!startResp.IsSuccessStatusCode)
            {
                _log($"[Pulsoid] Device auth failed: {(int)startResp.StatusCode}");
                return (false, "", $"HTTP {(int)startResp.StatusCode}");
            }

            var start      = JObject.Parse(startJson);
            var deviceCode = start["device_code"]?.ToString() ?? "";
            var consentUrl = start["verification_uri_complete"]?.ToString() ?? "";
            var expiresIn  = start["expires_in"]?.Value<int>() ?? 600;
            var interval   = Math.Max(1, start["interval"]?.Value<int>() ?? 3);
            if (string.IsNullOrEmpty(deviceCode) || string.IsNullOrEmpty(consentUrl))
                return (false, "", "bad_response");

            openUrl(consentUrl);
            _log("[Pulsoid] Waiting for account link...");

            var deadline = DateTime.UtcNow.AddSeconds(expiresIn);
            while (DateTime.UtcNow < deadline && !ct.IsCancellationRequested)
            {
                try { await Task.Delay(TimeSpan.FromSeconds(interval), ct); }
                catch (OperationCanceledException) { return (false, "", "cancelled"); }

                var pollBody = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["grant_type"]  = "urn:ietf:params:oauth:grant-type:device_code",
                    ["device_code"] = deviceCode,
                    ["client_id"]   = clientId,
                });
                var pollResp = await http.PostAsync(TokenUrl, pollBody, ct);
                var pollJson = await pollResp.Content.ReadAsStringAsync(ct);

                if (pollResp.IsSuccessStatusCode)
                {
                    var token = JObject.Parse(pollJson)["access_token"]?.ToString() ?? "";
                    if (string.IsNullOrEmpty(token)) return (false, "", "bad_response");
                    _log("[Pulsoid] Account linked");
                    return (true, token, "");
                }

                var err = "";
                try { err = JObject.Parse(pollJson)["error"]?.ToString() ?? ""; } catch { }
                if (err == "authorization_pending") continue;
                _log($"[Pulsoid] Link failed: {err}");
                return (false, "", string.IsNullOrEmpty(err) ? "failed" : err);
            }
            return (false, "", "expired_token");
        }
        catch (OperationCanceledException) { return (false, "", "cancelled"); }
        catch (Exception ex)
        {
            _log($"[Pulsoid] Link error: {ex.Message}");
            return (false, "", ex.Message);
        }
    }

    public void Dispose() { Stop(); }
}
