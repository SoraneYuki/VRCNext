namespace VRCNext;

public static class AppInfo
{
    public const string Version = "2026.46.5";
    public const string ContactAddress = "https://github.com/SoraneYuki/VRCNext";
    public const string Website = "github.com/SoraneYuki/VRCNext";
    public const string UserAgent = $"SoraneYuki-VRCNext/{Version} ({ContactAddress})";

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
