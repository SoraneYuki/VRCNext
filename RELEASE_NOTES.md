**2026.48.1**

**World Modal**
* Redesigned the stats at the top. Active players, favorites and visits are now shown in a cleaner stats card, while PC, Android and iOS download sizes moved into the Infos card.
* The **Instances** tab now has search, refresh and sorting options. You can search by instance name, ID or type and sort by Friends, Most Players, Age Gated or Group Instances.
* Added a **Set as Home** button next to New Instance and Favorite. It highlights when the world is already your home world.

**Deeplinks**
* New **vrcn://avatars/avtr_xxx/put/fav1** through **fav6** puts an avatar straight into that favorite group. Without the suffix the link opens the avatar as before.

**Lists**
* All list tables now use consistent header and cell sizes.
* List views now have a fixed height and consistent cell size.

**VR Overlay**
* VR content is now rendered directly on the GPU, reducing CPU usage while keeping the same appearance.
* The VR Overlay, friend toasts and FrameShot frame now use the new GPU rendering system.
* The VR Music Player album art background now uses a proper GPU blur for a smoother look at any size.
* More logging for VR Related Tools that help for debugging and error logging. 

**Fixed Bugs**
* Fixed the **Auto Color** theme not working correctly with dashboard backgrounds.
* Fixed profiles showing another user's avatar, keeping an avatar the person no longer wears, or losing the avatar when the profile was opened a second time.
* Fixed the avatar card flickering between two avatars while a profile was loading.
* Fixed the VRChat placeholder robot appearing as an avatar picture and as a profile banner.
* Fixed avatar lookups missing members of large groups, which searched only the newest 1000 entries.
