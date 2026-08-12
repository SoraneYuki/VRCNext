**2026.41.10**

**Improvements**
* Improved Light Mode on the Dashboard.
* Sidebar folders now use a larger 5x3 layout instead of 3x3.
* Updated the **X** close button on several modals to the new VRCN v2 design.

**Calendar**
* Updated Calendar to the VRCN v2 design.
* Calendar now shows up to 2 events per day, with **"X more events"** for additional events.
* Added a new **Week View** for a better overview of upcoming events.
* Calendar now uses the same date picker as Timeline.
* Added **Help Sort**, which gives each group a fixed color to make events easier to tell apart.
* Fixed Calendar cells not resizing correctly with the window.

**Performance**
* Fixed several memory leaks that could increase RAM usage during long sessions.
* Improved memory cleanup for VR Overlay notifications, visited worlds, player profiles, Voice Fight, and Kikitan XD.
* Improved performance for users with very large friend lists.
* Friend updates now only refresh the parts of the UI that actually changed instead of rebuilding the entire Friends Sidebar and Dashboard.
* Status, location, and avatar changes now only update that specific friend's card.
* Reduced CPU and memory usage when updating large friend lists.
* VRCNext now regularly cleans up unused memory during long sessions.
* Added **Settings > Performance > Image Cache > Optimize Memory Usage**, enabled by default.
* Smaller avatars and icons now use lightweight thumbnails, while larger cards use 256px images instead of 800px. This can greatly reduce RAM and GPU memory usage.
* Full-quality images are still shown when opening or inspecting them.
* Image memory settings apply immediately without restarting VRCNext.

**Changes**
* The Notification Modal now uses the new refresh button design.
* Changed the colors ofr instance types.
* Changed the status colors slightly to be more saturated.
* Updated People tab to new edit mode. should have the same behavior as world tab now.
* Updated Avatars tab to new edit mode. should have the same behavior as world tab now.
