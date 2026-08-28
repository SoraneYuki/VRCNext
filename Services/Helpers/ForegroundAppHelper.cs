using System.Diagnostics;
using System.Runtime.InteropServices;

namespace VRCNext.Services.Helpers;

public static class ForegroundAppHelper
{
#if WINDOWS
    [DllImport("user32.dll")]
    private static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);

    private static uint   _cachedPid;
    private static string _cachedName = "";
#endif

    /// <summary>Display name of the app that currently owns the foreground window, or "" when unknown.</summary>
    public static string GetActiveAppName()
    {
#if WINDOWS
        try
        {
            var hWnd = GetForegroundWindow();
            if (hWnd == IntPtr.Zero) return "";
            GetWindowThreadProcessId(hWnd, out var pid);
            if (pid == 0) return "";
            if (pid == _cachedPid) return _cachedName;

            using var proc = Process.GetProcessById((int)pid);
            var name = "";
            try
            {
                var path = proc.MainModule?.FileName;
                if (!string.IsNullOrEmpty(path))
                    name = FileVersionInfo.GetVersionInfo(path).FileDescription ?? "";
            }
            catch { }
            if (string.IsNullOrWhiteSpace(name)) name = proc.ProcessName;

            _cachedPid  = pid;
            _cachedName = name.Trim();
            return _cachedName;
        }
        catch { return ""; }
#else
        return "";
#endif
    }
}
