**2026.47.2**

**Timeline**
* Notifications are now colour coded: green for friend requests, orange for groups, cyan for world invites, yellow for everything else.

**Fixed**
* **Taskbar notifications**: all buttons were broken (Current, Hidden, Refresh, Clear All, Accept, Hide, quick replies). They work again.
* **Chatbox**: stopped sending messages on PCs running longer than 25 days without a restart.
* **Security**: websites could read files from your disk through the local media server. Access is now restricted to VRCNext, with each route locked to its own folder and background images limited to a fixed list.
* **Friends**: locations, names and GPS status could get out of sync or drop updates.
* **Settings**: a crash or power loss during saving could corrupt the settings file, wiping your settings and accounts. Saving is now crash-safe, with an automatic backup as fallback.
* **VRChat log**: half-written lines were read too early, causing join events without a user ID.
* **Timeline**: the seven-day cutoff for cached world thumbnails was shifted by your timezone.
* **HypeRate**: the UI could show "not connected" while heart rate data was still arriving.
* **Translations**: 50 missing texts added to English and German, plus 35 German texts that were English-only. Two duplicate keys removed.