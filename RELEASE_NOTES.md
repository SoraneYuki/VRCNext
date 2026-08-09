**2026.41.5**

**Avatar Search**

**i18n**

* Added **zh-TW** localization and a **zh-TW** language button.
  By @SoraneYuki

**Linux Improvements**

* Added an NVIDIA driver check and automatically applies `WEBKIT_DISABLE_DMABUF_RENDERER=1` when required.
  By @SharkieWasHere

**Networking**

* Switched networking to **HTTP/2**.

**Fixed Bugs**

* Fixed out-of-memory crashes caused by interface messages being duplicated in memory for logging. This unnecessary logging has been disabled.
* Removed an aggressive garbage collection setting that could cause out-of-memory errors during large database searches and imports. The scheduled 10-minute memory cleanup remains unchanged.
* Fixed the VRChat process state being checked twice every 5 seconds.
* Fixed VRCNext refusing to start on systems with a newer .NET version than the version it was built against.
* Significantly reduced disk usage during Media Library scans by improving how photo metadata is read.
* In a test with 758 photos, disk reads dropped from **3.36 GB to 350 MB** and disk operations from **828,316 to 51,307**.
* For a library of around 40,000 photos, estimated scan reads are reduced from roughly **168 GB to 1.3 GB**.
* World IDs, author names and player lists remain unchanged. The new reader was verified against an existing photo library with no differences.
