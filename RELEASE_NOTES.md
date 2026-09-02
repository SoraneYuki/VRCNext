**2026.48.2**

**Fixed Bugs**
* Fixed profiles showing a different avatar than **Check for Avatar** for the same person. Both now use the same lookup.
* Fixed profiles showing **Loading․․․** as the current avatar. That is VRChat's placeholder avatar, shown while someone's real avatar is still downloading, and it is now ignored like the robot placeholder, in profiles, in lists and as a picture.
* Fixed the avatar lookup being skipped for five minutes after a profile was opened, which left the card empty or stale when the same profile was opened again.

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

**OSC Tool**
* Now uses OSCQuery, the official protocol, to read the full live parameter list straight from VRChat, including the built-in parameters, instead of relying on the local config files.

**Activity Log**
* Repeated OSC sends like the heart rate no longer spam the log every second. Each parameter is now logged at most once every 30 seconds, so you can still confirm data is flowing without the flood.

**VR Overlay**
* VR content is now rendered directly on the GPU, reducing CPU usage while keeping the same appearance.
* The VR Overlay, friend toasts and FrameShot frame now use the new GPU rendering system.
* The VR Music Player album art background now uses a proper GPU blur for a smoother look at any size.
* More logging for VR Related Tools that help for debugging and error logging. 

**Fixed Bugs**
* Fixed the calendar not showing events of the following month. Only the displayed month was loaded, so days of the next month that appear in the grid, and weeks that run across the turn of the month, stayed empty. The current and the next month are now always loaded together.
* Fixed the **OSC Tool** showing the wrong avatar's parameters, parameters of a gimmick you did not have on, or a parameter count that changed every time you reconnected. It now reads the full live parameter list of the avatar you are wearing straight from VRChat and only falls back to the local config file as a last resort, matched to that avatar.
* Fixed the **Auto Color** theme not working correctly with dashboard backgrounds.
* Fixed profiles showing another user's avatar, keeping an avatar the person no longer wears, or losing the avatar when the profile was opened a second time.
* Fixed the avatar card flickering between two avatars while a profile was loading.
* Fixed the VRChat placeholder robot appearing as an avatar picture and as a profile banner.
* Fixed avatar lookups missing members of large groups, which searched only the newest 1000 entries.
