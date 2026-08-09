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
* Fixed the media library scan saturating the disk on startup. Reading the world and author information out of a photo used to jump through the file around 774 times per image, in two separate passes. It now reads the start and the end of the file once each and evaluates everything in memory.
* Measured on a library of 758 photos: reads dropped from 3363 MB to 350 MB and disk operations from 828,316 to 51,307. For a library of 40,000 photos that is roughly 168 GB down to 1.3 GB per scan.
* World IDs, author names and player lists are unchanged. The new reader was verified against every photo in a real library with zero differences, and the refresh button still performs a full rescan.