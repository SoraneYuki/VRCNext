using System;
using Valve.VR;

namespace VRCNext.Services;

internal static class OpenVrInitHint
{
    public static string? Describe(EVRInitError overlayErr, EVRInitError backgroundErr)
    {
        var code = IsIpc(overlayErr) ? overlayErr : backgroundErr;
        if (!IsIpc(code)) return null;
        return $"Could not reach SteamVR ({code}). If SteamVR is running, VRCNext and Steam are probably running with different rights (one of them as administrator). Start both normally, or both as administrator.";
    }

    private static bool IsIpc(EVRInitError e) =>
        e.ToString().StartsWith("IPC_", StringComparison.Ordinal);
}
