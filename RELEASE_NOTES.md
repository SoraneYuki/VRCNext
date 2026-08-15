**2026.41.13**

**Dashboard**

* The hero section now hosts two widgets right on your world background. Left shows **Friends Activity** with friends, their status and current world, or **Group Activity**. Right shows the **Next Event** as a big card, or **VRChat News**.
* An arrow below the hero scrolls down to your custom widget section.
* Hero **Friends Activity** and **Group Activity** got a See All link. Friends jumps to People > All Friends filtered to In-Game, groups jump to the new Group Instances tab.

**Groups**

* New **Group Instances** tab next to Joined Groups. It lists every active instance across all your groups using a single API call, with world image cards showing instance type, region, age gate, group and player count. A list view and refresh button are included.
* Hero widgets are edited through Edit Dashboard too, each side offers its own picker and can be emptied.
* **VRChat News** moved into the hero and left the custom widget pool.
* **Edit Dashboard** is now an inline layout editor. Click Edit Dashboard and plus buttons appear right inside the dashboard. Add a container and choose 1 or 2 columns, then press the plus inside a container to pick any widget for that slot. Containers can be dragged up and down by their handle to reorder, widgets and containers can be removed on the spot and every change saves automatically.
* Two widgets can now sit side by side thanks to the new container system. Existing layouts are migrated automatically.
* Full v2 redesign of every widget.
* Section headers, refresh buttons and See All links got the v2 treatment with proper icons.
* **VRChat News** is now a hero article with a compact side rail and shows the last 6 articles instead of 3. The date became a badge and the whole card is clickable, no more Show More buttons.
* **Upcoming Events** shows up to 9 events instead of 4 and got calendar date tiles. The featured event shows the date as a floating tile on the image with time and group as glass badges, the other 8 list beside it with date tile, time, group icon and group name.
* **Your Instances** cards now show the instance region, and instances with a known capacity display a fill bar.
* **Recent Photos** turned from a huge mosaic into a compact two row photo strip with drag scrolling, mixed tile sizes and always visible dates.
* **My Avatars** and **Favorite Avatars** switched to portrait tiles with the name below the image. The currently worn avatar gets an accent ring.
* **My Recent Activity** and **Friends Recent Activity** keep the full timeline list with all details but drop the row separator lines for a cleaner look.
* **Popular Worlds** and **Very Active Worlds** are now ranked top 10 lists with position numbers and live player counts instead of card shelves.
* **Recently Visited** leads with a bigger card for the last world and shows player counts again.
* Widgets start lower on the hero image now, revealing more of your world background.
* Removed the widgets **Friends Locations (big)**, **Group Activity (big)**, **Your Groups**, **Discover Worlds**, **Friends Activity** and **Quick Controls**. Their content lives on in the small widget variants and the Worlds, Groups and People tabs.
* Reordering and hiding widgets through the layout editor works exactly as before, removed widgets disappear from saved layouts automatically.

**Performance**

* VRCNext now returns unused memory to Windows more aggressively, lowering the memory usage of the main process.
* Memory Trim is now enabled by default for new installations and runs every 15 minutes.
* The VR helper process no longer starts with the app. It now only starts when a VR tool actually needs it and shuts itself down when nothing is using it, saving around 100 MB of memory for everyone who does not use VR features.

**Fixed Bugs**

* Fixed the horizontal scroll position under People > Instance jumping back every few seconds while the player list refreshed.