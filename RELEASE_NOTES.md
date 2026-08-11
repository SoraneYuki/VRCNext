**2026.41.6**

**Permini**
* Added advanced settings to every user item.
* You can now choose which days a rule is active and set a specific time range.
* For example, you can make a rule active on Monday and Friday between 07:00 and 12:00.

**Status Schedule**
* Added **Instance Condition**. Change your status based on the instance you are currently in.
* Added **Friend Condition**. Change your status when a specific friend is present in your instance.
* Added **Player Count Condition**. Change your status based on the current player count from 0 to 80.

**Saving/Store**
* Migrating photo store from json to SQLite.
* Migrating new rating system to SQLite and merge with photo store.
* Database now stores metadata for photos such as Player, Size, Tags, Rating, Favorited State, Players in instance.
It will still run background scans but we show the sql cache first for faster response.

**VR Overlay**
* Added **SteamVR Input** support for Valve Index controllers.
* New dropdown next to the controller view switch: **Legacy (Default)** or **SteamVR (Index)**.
* Keybinds are stored separately per mode. Switching back to Legacy restores your old binds, nothing is overwritten.
* Added an Index controller image. Keybinds can be clicked directly on the controller in both modes.
* Clicking a spot on the controller opens its inputs. Green is the button, blue is touch or force.

**Media Library**
* Added Photo rating that uses and ready windows propertie files. You can assign a  rating when opening the photo.
* Added a Rating filter that shows your images based on rating.
* Show count badge on sidebar.

Rated images aren't favorited images. both are seperated things keep that in mind.

**Context Menu**
* Added "Rating" sub menu for media library to quick rate images.
* Move the Upload/Set as/Banner/Profile Icon to a sub dropdown inside the media gallery to make some space.

**Improvements**
* Profiles show now both "Age Verified" and a "18+" Badge.
* The own status shows now a circle when VRChat is currently not running.

**Fixed Bugs**
* The 18+ Badge was shown on profiles when they were age verified. However this doesnt mean they're 18+. this has been fixed.
* TTS (Test button and notifications) could silently stop working completely after a network hiccup on the Edge voice engine, requiring a restart to fix. This has been fixed.
* Fixed friend picker design to have v2 design.
* Fixed an bug that made the media library use alot of system source on initial load.