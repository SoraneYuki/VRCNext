**2026.43.5**

**Notifications**
* The notification center is about 50% wider, so titles and messages have room to breathe and
message text can wrap over two lines.
* Every notification now shows its type as a badge, for example **Friend Request** or
**Group Announcement**, next to the time it arrived.
* Added a **Clear all notifications** button next to Refresh, the same action the VRChat website
uses. It only shows up when the current list actually has notifications.
* Added **View all notifications** at the bottom, which opens Timeline > Personal > Notifications.

**System Tray**
* Redesigned the tray menu to match the new sidebar and made it about 25% more compact.
* The tray now shows your full, localized status, such as **"Ask Me - sleeping"**.
* Improved sharpness on scaled/high-DPI displays.
* The tray menu now opens directly where you right-click the tray icon.

**Design Refactor**
* Changed some of the base theme colors.

**Friends Sidebar**
* Added "Friends/Group" mini buttons so you can switch between friends view and group view.
This makes navigating way easier and seperating groups and friends in the sidebar appears to be
a better way.
* Removed world images from "Same Instance" sections and put them in a card instead.
That safes some memory and looks less roblox like :p.
* Added **Separate Friends and Favorite Friends** under **Settings > Sidebar > Friends Sidebar** (off by default).
When enabled you can switch between Friends, Favorites and Groups. If this setting is disabled you will only see Friends and Groups, and your favorite friends stay inside the normal Friends tab as usual.

**Performance**
* Cached images are no longer reloaded on every app start, which makes startup lighter.
* Fixed a memory leak in the world cache that made memory usage grow steadily during long sessions.

**VR Overlay**
* Added a **Friend leaves your instance** notification under **Overlay Notifications**, with its own Show and TTS toggles. Leaving a world yourself does not count as your friends leaving.
* Added an **Invite Request** notification under **Overlay Notifications**, shown when someone asks you for an invite. Also has Show and TTS toggles.

**Fixed Bugs**
* Friends listed under **Same Instance** are no longer repeated in the **In-Game** section, since being in a shared instance already means they are in game.
* Fixed a memory leak in **Space Flight** and **FrameShot** that could cause several GB of extra memory usage during long sessions.
* Space Flight and FrameShot now correctly restore their status after a UI reload.
* Reduced unnecessary microphone meter updates in **Voice Fight** and **Kikitan XD**.
* Fixed the **Kikitan XD** noise gate slider briefly resetting the meter to zero.
* Fixed a startup error where two **Media Library** scans could run at the same time and corrupt the photo size cache.
* Fixed backend messages getting lost when they were sent before the app window finished initializing.
