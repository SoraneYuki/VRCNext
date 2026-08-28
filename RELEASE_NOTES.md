**2026.47.2**

**Timeline**
* Notifications are now colour coded: green for friend requests, orange for groups, cyan for world invites, yellow for everything else.

**Action Flow**
* New **Get Info** block **heart rate (int)** returns the current BPM from the Custom Chatbox HypeRate connection (0 when no data).
* **set OSC bool / float / int** now send even when the OSC Tool is not started; the OSC Tool is only needed for receiving parameters.
* New **VRCN Actions** trigger **do every second** for OSC and other local tasks. It runs VRCN Actions and Logic blocks only; VRC Actions and Webhook Actions inside it are skipped and logged, so it can never spam the VRChat API.
* The three **send notification** blocks moved from VRC Actions to **VRCN Actions**, so they can be used inside **do every second**.

**Custom Chatbox**
* New toggle **Allow Action Flow using Heart Rate** under Heart Rate. When enabled, the HypeRate connection stays alive so Action Flow can read the heart rate even while the chatbox is off.

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