**2026.38.1**

**Performance**

* Added an **Efficiency Mode** option in **Settings > Performance**. When enabled, VRCNext runs in Windows Efficiency Mode to save power and background CPU usage.
* Scrolling the Dashboard is now much smoother and uses way less CPU.
* Friend status updates now cause much less background work, especially with large friend lists.
* Tabs that are not visible are no longer re-rendered in the background.
* Typing in search and filter fields now feels smoother.

**Memory Usage**

* Groups are now only loaded when the Groups tab is opened, and images load while scrolling.
* Images across the app now load only when they become visible, which reduces RAM usage a lot.
* Video backgrounds now pause while they are not visible.
* Video thumbnails in the Media Library now use less memory.

**Changes**
* GPU Acceleration is now on by default. If you don't want that you can disable it in
Settings > Performance. Disabling GPU Acceleration may cause stutter on some places but safes GPU Usage. This may also increase CPU usage on active use.

**Import**

* Added Avatar Favorite Import.
* Added World Favorite Import.
* Avatars and worlds can already be exported through **Taskbar > Tools > Export**.
* You can now use **Taskbar > Tools > Import** to import favorited avatars or worlds to another VRChat account.
* A modal will ask which favorite groups the avatars or worlds should be imported into.

**Avatar Search**

* Added a **Performance** filter to VRCNDb.
* Added a **Face Tracking** filter to VRCNDb.
* Added a **Content** filter to VRCNDb.
* Added a **Platform** filter to VRCNDb, AvtrDb, and CuteAvatarSearch.

**Improvements**

* Favorite groups can now be renamed more easily while Edit Mode is enabled in the Avatars, Friends, or Worlds tab.
* Added more spacing between Timeline list categories to improve readability.
* Added separation lines between favorite groups when the line design is enabled.
* User profiles now show 36 mutual friends and content items per page.
* World modals now show 15 images per page.
* Right-clicking your own profile now also shows **Recently Used Status Texts** and **Edit Status Text**.
* Changed the yellow favorite color to the custom theme accent color.
* Avatar modals now show performance ranks using the original VRChat icons.
* Avatar Search now shows PC, Android, and iOS performance ranks using the original VRChat icons.
* Removed the **Current** badge from avatars because the outline already indicates which avatar is currently in use.
* Added platform icons to avatar modals and preview cards.

**Fixes**

* Fixed button misalignments in the Groups tab.
* Fixed an issue where **Copy to Clipboard** did not work in user profiles or the Inventory tab.
* Fixed an issue where images did not appear in world modals until the Media Library had been opened once.
* Fixed an issue where the breadcrumb navigation could sometimes switch between tabs unexpectedly.
* Fixed an issue where content could overflow in profile modals when too many items were displayed.
* Fixed user ID search not working in VRCNDb Avatar Search.
* Fixed renamed favorite groups in the Avatars tab not showing the updated name.
* Fixed renamed favorite groups in the Worlds tab not showing the updated name.
