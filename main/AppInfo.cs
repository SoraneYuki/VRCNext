namespace VRCNext;

public static class AppInfo
{
    public const string Version = "Y2026.46.4";
    public const string ContactEmail = "none";
    public const string Website = "none";
    public const string UserAgent = $"VRCNext Yuki Edit /{Version} ({ContactEmail})";

    public static string SelfExecutable
    {
        get
        {
            var appImage = Environment.GetEnvironmentVariable("APPIMAGE");
            if (!string.IsNullOrEmpty(appImage) && File.Exists(appImage)) return appImage;
            return Environment.ProcessPath ?? "";
        }
    }
}
