using System.Net.WebSockets;
using System.Text;
using System.Threading;
using Newtonsoft.Json.Linq;

namespace VRCNext.Services;

public sealed class HypeRateService : IDisposable
{
    private const string WsBase = "wss://app.hyperate.io/ws/";
    private const int PingIntervalSec = 15;
    private const int StaleSeconds = 60;
    private const int MaxBackoffSec = 60;

    private readonly Action<string> _log;
    private CancellationTokenSource? _cts;
    private bool _running;
    private string _deviceId = "";

    public int    CurrentBpm  { get; private set; }
    public bool   IsConnected { get; private set; }
    public string LastError   { get; private set; } = "";
    private DateTime _lastBeatUtc = DateTime.MinValue;

    public event Action? StateChanged;

    public HypeRateService(Action<string> log) => _log = log;

    public bool HasFreshData => CurrentBpm > 0 && (DateTime.UtcNow - _lastBeatUtc).TotalSeconds <= StaleSeconds;

    public void Start(string deviceId, string apiKey)
    {
        deviceId = (deviceId ?? "").Trim();
        if (_running && deviceId == _deviceId) return;
        Stop();
        if (string.IsNullOrEmpty(deviceId) || string.IsNullOrWhiteSpace(apiKey)) return;

        _deviceId = deviceId;
        _running  = true;
        _cts      = new CancellationTokenSource();
        LastError = "";
        _ = ConnectLoopAsync(apiKey, _cts.Token);
    }

    public void Stop()
    {
        _running = false;
        try { _cts?.Cancel(); } catch { }
        _cts?.Dispose();
        _cts = null;
        if (IsConnected || CurrentBpm != 0)
        {
            IsConnected  = false;
            CurrentBpm   = 0;
            _lastBeatUtc = DateTime.MinValue;
            StateChanged?.Invoke();
        }
    }

    private async Task ConnectLoopAsync(string apiKey, CancellationToken ct)
    {
        int delaySec = 1;

        while (_running && !ct.IsCancellationRequested)
        {
            using var ws = new ClientWebSocket();
            try
            {
                var url = WsBase + Uri.EscapeDataString(_deviceId) + "?token=" + Uri.EscapeDataString(apiKey);
                await ws.ConnectAsync(new Uri(url), ct);
                _log($"[HypeRate] Connected to {_deviceId}");
                IsConnected = true;
                LastError   = "";
                StateChanged?.Invoke();
                delaySec = 1;

                await SendAsync(ws, new JObject
                {
                    ["topic"]   = "hr:" + _deviceId,
                    ["event"]   = "phx_join",
                    ["payload"] = new JObject(),
                    ["ref"]     = "1",
                }, ct);

                var ping = PingLoopAsync(ws, ct);
                await ReceiveLoopAsync(ws, ct);
                await ping;
            }
            catch (OperationCanceledException) { break; }
            catch (Exception ex)
            {
                LastError = ex.Message;
                _log($"[HypeRate] Connect error: {ex.Message}");
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

    private async Task PingLoopAsync(ClientWebSocket ws, CancellationToken ct)
    {
        while (!ct.IsCancellationRequested && ws.State == WebSocketState.Open)
        {
            try { await Task.Delay(TimeSpan.FromSeconds(PingIntervalSec), ct); }
            catch (OperationCanceledException) { return; }
            if (ws.State != WebSocketState.Open) return;
            try
            {
                await SendAsync(ws, new JObject
                {
                    ["event"]   = "ping",
                    ["payload"] = new JObject { ["timestamp"] = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() },
                }, ct);
            }
            catch { return; }
        }
    }

    private static async Task SendAsync(ClientWebSocket ws, JObject msg, CancellationToken ct)
    {
        var bytes = Encoding.UTF8.GetBytes(msg.ToString(Newtonsoft.Json.Formatting.None));
        await ws.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, ct);
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
            var msg = JObject.Parse(payload);
            if (msg["event"]?.ToString() != "hr_update") return;
            var bpm = msg["payload"]?["hr"]?.Value<int>() ?? 0;
            if (bpm <= 0) return;
            var changed  = bpm != CurrentBpm;
            CurrentBpm   = bpm;
            _lastBeatUtc = DateTime.UtcNow;
            if (changed) StateChanged?.Invoke();
        }
        catch (Exception ex) { _log($"[HypeRate] Parse error: {ex.Message}"); }
    }

    public void Dispose() { Stop(); }
}
