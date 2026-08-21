**2026.43.5**

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
