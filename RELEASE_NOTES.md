**2026.39.0 BETA**

**Performance (Backend)**

* Greatly reduced RAM usage of the VRCNext process. Memory is now capped and cleaned up much more aggressively.
* Fixed an issue where the built-in memory optimization was never actually applied.
* Reduced memory usage of internal logging and databases.

**Performance (Frontend)**

* Added **Efficiency Mode** under **Settings > Performance** to reduce power and background CPU usage.
* Improved Dashboard scrolling and reduced CPU usage.
* Reduced background work from friend status updates, especially with large friend lists.
* Hidden tabs are no longer re-rendered in the background.
* Improved typing performance in search and filter fields.
* Groups now load only when the Groups tab is opened.
* Images across the app now load only when visible.
* Video backgrounds pause while hidden.
* Media Library video thumbnails now use less memory.
* GPU Acceleration is now enabled by default and can be disabled under **Settings > Performance**. Disabling it may reduce GPU usage but can increase CPU usage and cause stuttering.

**Import**

* Added Avatar Favorite Import.
* Added World Favorite Import.
* Export avatars and worlds through **Taskbar > Tools > Export**.
* Import them to another VRChat account through **Taskbar > Tools > Import**.
* Select which favorite groups they should be imported into.

**Avatar Search**

* Added a **Performance** filter to VRCNDb.
* Added a **Face Tracking** filter to VRCNDb.
* Added a **Content** filter to VRCNDb.
* Added a **Platform** filter to VRCNDb, AvtrDb, and CuteAvatarSearch.

**Improvements**

* Favorite groups can now be renamed more easily in Edit Mode.
* Added more spacing between Timeline categories.
* Added separation lines between favorite groups when the line design is enabled.
* User profiles now show 36 mutual friends and content items per page.
* World modals now show 15 images per page.
* Right-clicking your own profile now shows **Recently Used Status Texts** and **Edit Status Text**.
* The yellow favorite color now uses the custom theme accent color.
* Avatar modals now use the original VRChat performance rank icons.
* Avatar Search now shows PC, Android, and iOS performance ranks using the original VRChat icons.
* Removed the **Current** avatar badge because the outline already shows the active avatar.
* Added platform icons to avatar modals and preview cards.

**Fixes**

* Fixed button misalignments in the Groups tab.
* Fixed **Copy to Clipboard** in user profiles and the Inventory tab.
* Fixed world modal images not appearing until the Media Library had been opened.
* Fixed breadcrumb navigation sometimes switching tabs unexpectedly.
* Fixed content overflowing in profile modals when too many items were displayed.
* Fixed user ID search in VRCNDb Avatar Search.
* Fixed renamed favorite groups not updating in the Avatars tab.
* Fixed renamed favorite groups not updating in the Worlds tab.
