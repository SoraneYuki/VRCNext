**2026.44.1**

**Translations**
* Korean Translation by @roshikeymusica
* Update Traditional Chinese localization by @SoraneYuki

**User Profiles**
* **Friends** and **Groups** moved into the search bar of Shared Connections, so search, both tabs
and the sort dropdown now sit in one row.

**Messages**
* Redesigned the message list with cards to match the V2 design.
* The header now shows the number of open conversations.

**Notifications**
* Redesigned the notification center with cleaner cards for each notification.
* Notification types are now color coded for easier recognition.
* The header now shows the total number of notifications.
* Fixed notifications getting squished when many were shown. The list now scrolls properly.

**Design**
* Small color adjustments on all themes.

**Fixed Bugs**
* Fixed friends sidebar searchbar card seperation.
* Fixed tools and startup apps with **Start with VR/Desktop** sometimes not starting again after VRChat was closed and restarted, for example after killing a stuck VRChat from the SteamVR dashboard. VRChat restarts are now detected reliably, no matter how VRChat was started or stopped.
* Auto-start can no longer accidentally turn a tool **off** when it was still running.
* Failed auto-starts (for example while SteamVR is still starting up) are now retried automatically instead of silently giving up.
* VR mode detection at VRChat start now waits briefly for SteamVR instead of guessing Desktop mode too early.
* **Close with VRChat** no longer closes copies of a startup app that you started manually yourself.
* Tool auto-start no longer depends on the **Start always with VRChat** setting, which only applies to external startup apps as described.