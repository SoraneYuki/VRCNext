using System.Net.Http;
using System.Threading;
using Newtonsoft.Json.Linq;

namespace VRCNext.Services;

public sealed class WeatherService : IDisposable
{
    private const string GeoUrl      = "https://geocoding-api.open-meteo.com/v1/search";
    private const string ForecastUrl = "https://api.open-meteo.com/v1/forecast";
    private const int RefreshMinutes = 10;

    private readonly Action<string> _log;
    private readonly HttpClient _http = new() { Timeout = TimeSpan.FromSeconds(15) };
    private CancellationTokenSource? _cts;
    private string _city = "";
    private string _unit = "celsius";
    private double _lat, _lon;
    private bool _hasCoords;

    public string CityLabel   { get; private set; } = "";
    public double Temperature { get; private set; }
    public int    WeatherCode { get; private set; } = -1;
    public bool   HasData     { get; private set; }
    public string LastError   { get; private set; } = "";

    public event Action? StateChanged;

    public WeatherService(Action<string> log) => _log = log;

    public string UnitSuffix => _unit == "fahrenheit" ? "°F" : "°C";

    public void Start(string city, string unit)
    {
        city = (city ?? "").Trim();
        unit = unit == "fahrenheit" ? "fahrenheit" : "celsius";
        if (city == _city && unit == _unit && _cts != null) return;

        Stop();
        if (string.IsNullOrEmpty(city)) return;

        _city      = city;
        _unit      = unit;
        _hasCoords = false;
        HasData    = false;
        LastError  = "";
        _cts       = new CancellationTokenSource();
        _ = LoopAsync(_cts.Token);
    }

    public void Stop()
    {
        try { _cts?.Cancel(); } catch { }
        _cts?.Dispose();
        _cts = null;
        if (HasData)
        {
            HasData = false;
            StateChanged?.Invoke();
        }
    }

    private async Task LoopAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                if (!_hasCoords) await ResolveCityAsync(ct);
                if (_hasCoords) await FetchAsync(ct);
            }
            catch (OperationCanceledException) { return; }
            catch (Exception ex)
            {
                LastError = ex.Message;
                _log($"[Weather] {ex.Message}");
                StateChanged?.Invoke();
            }

            try { await Task.Delay(TimeSpan.FromMinutes(RefreshMinutes), ct); }
            catch (OperationCanceledException) { return; }
        }
    }

    private async Task ResolveCityAsync(CancellationToken ct)
    {
        var url = $"{GeoUrl}?name={Uri.EscapeDataString(_city)}&count=1&language=en&format=json";
        var json = await _http.GetStringAsync(url, ct);
        var first = (JObject.Parse(json)["results"] as JArray)?.FirstOrDefault() as JObject;
        if (first == null)
        {
            LastError = "city_not_found";
            StateChanged?.Invoke();
            return;
        }
        _lat = first["latitude"]?.Value<double>() ?? 0;
        _lon = first["longitude"]?.Value<double>() ?? 0;
        var name    = first["name"]?.ToString() ?? _city;
        var country = first["country_code"]?.ToString() ?? "";
        CityLabel   = string.IsNullOrEmpty(country) ? name : $"{name}, {country}";
        _hasCoords  = true;
        LastError   = "";
        _log($"[Weather] {CityLabel} ({_lat:F2}, {_lon:F2})");
    }

    private async Task FetchAsync(CancellationToken ct)
    {
        var url = $"{ForecastUrl}?latitude={_lat.ToString(System.Globalization.CultureInfo.InvariantCulture)}"
                + $"&longitude={_lon.ToString(System.Globalization.CultureInfo.InvariantCulture)}"
                + $"&current=temperature_2m,weather_code&temperature_unit={_unit}";
        var json = await _http.GetStringAsync(url, ct);
        var cur  = JObject.Parse(json)["current"] as JObject;
        if (cur == null) { LastError = "bad_response"; StateChanged?.Invoke(); return; }
        Temperature = cur["temperature_2m"]?.Value<double>() ?? 0;
        WeatherCode = cur["weather_code"]?.Value<int>() ?? -1;
        HasData     = true;
        LastError   = "";
        StateChanged?.Invoke();
    }

    /// <summary>WMO weather interpretation codes, mapped to a single glyph.</summary>
    public static string CodeToEmoji(int code) => code switch
    {
        0            => "☀️",
        1 or 2       => "\U0001F324️",
        3            => "☁️",
        45 or 48     => "\U0001F32B️",
        51 or 53 or 55 or 56 or 57 => "\U0001F326️",
        61 or 63 or 65 or 66 or 67 or 80 or 81 or 82 => "\U0001F327️",
        71 or 73 or 75 or 77 or 85 or 86 => "\U0001F328️",
        95 or 96 or 99 => "⛈️",
        _            => "\U0001F324️",
    };

    public void Dispose() { Stop(); _http.Dispose(); }
}
