**2026.41.5**

**Avatar Search**

**i18n**
* Added **zh-TW** localization and a **zh-TW** language button.
  By @SoraneYuki

**Linux Improvements**
* Added an NVIDIA driver check in `./main/Program.cs`.
* Added the `WEBKIT_DISABLE_DMABUF_RENDERER=1` environment variable when required, with an automatic restart to apply the change.
  By @SharkieWasHere

**Networking**
* Switched to http2

**Fixed Bugs**
* Fixed out of memory crashes caused by every message sent to the interface being copied an extra time in memory for log output. Logging is now turned off, which removes a full copy of every payload.
* Removed an aggressive garbage collector setting that kept the heap small and could trigger out of memory errors during large operations such as database searches and imports. The scheduled memory trim that compacts the heap every 10 minutes is untouched and still runs.
* Fixed the VRChat process state being requested twice every 5 seconds by two separate timers.
* Fixed VRCNext refusing to start with "You must install or update .NET" on systems that only have a newer .NET version installed than the one VRCNext was built against.