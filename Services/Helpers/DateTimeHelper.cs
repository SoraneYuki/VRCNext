using System.Globalization;

namespace VRCNext.Services.Helpers;

public static class DateTimeHelper
{
    public static string ShortDatePattern => CultureInfo.CurrentCulture.DateTimeFormat.ShortDatePattern;

    public static bool Is24Hour =>
        !CultureInfo.CurrentCulture.DateTimeFormat.ShortTimePattern.Contains("tt");

    public static string FormatTime(DateTime dt) => dt.ToString("t", CultureInfo.CurrentCulture);

    public static string FormatTimeWithSeconds(DateTime dt) => dt.ToString("T", CultureInfo.CurrentCulture);

    public static string Iso(Newtonsoft.Json.Linq.JToken? token)
    {
        if (token == null || token.Type == Newtonsoft.Json.Linq.JTokenType.Null) return "";
        if (token.Type == Newtonsoft.Json.Linq.JTokenType.Date)
            return ((Newtonsoft.Json.Linq.JValue)token).Value is DateTime dt
                ? dt.ToString("o", CultureInfo.InvariantCulture)
                : Iso(token.ToString());
        return Iso(token.ToString());
    }

    public static bool TryParseUtc(string? value, out DateTime utc)
    {
        if (DateTime.TryParse(value, CultureInfo.InvariantCulture,
                DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal, out utc))
            return true;
        utc = default;
        return false;
    }

    public static string Iso(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return "";
        if (DateTime.TryParse(value, CultureInfo.InvariantCulture,
                DateTimeStyles.RoundtripKind | DateTimeStyles.AllowWhiteSpaces, out var utc))
            return utc.ToString("o", CultureInfo.InvariantCulture);
        if (DateTime.TryParse(value, CultureInfo.CurrentCulture,
                DateTimeStyles.AllowWhiteSpaces, out var local))
            return local.ToString("o", CultureInfo.InvariantCulture);
        return value;
    }
}
