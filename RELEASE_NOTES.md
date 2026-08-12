**2026.41.10**

**Calendar**

* Calendar is now using the VRCN v2 design.
* Calendar now shows a maximum of 2 events per day, with an additional **"X more events"** indicator to keep day cards from becoming too large.
* Added a **Week View** to easily see what's happening throughout the week.
* Calendar now uses the same date picker as Timeline.
* Added "Help Sort" button to Calendar which gives every group a fixed color to help seperate events.

**Performance**

* Fixed a memory leak in the VR Overlay where friend avatar images from notifications could stay in RAM permanently. They are now cleaned up automatically.
* Fixed a memory leak where worlds visited by friends could stay in RAM permanently. The world cache is now limited and reuses memory.
* Fixed memory buildup with very large friend lists where repeated updates could pile up large messages in RAM. Updates are now merged so only the latest state is delivered.
* Fixed a memory buildup where profiles of players you previously met could stay in RAM. The profile cache now cleans itself up while players in your current instance remain unaffected.
* Friend list updates now use a single database query instead of one query per friend, reducing CPU and memory usage for large friend lists.
* Fixed a rare memory leak in Voice Fight and Kikitan XD where microphone audio could pile up in RAM if speech recognition crashed in the background.
* VRCNext now regularly compacts its memory to reduce memory growth during long sessions.

**Fixed Bugs**
* Fixed an issue where the calendar cells werent resizing base don window size.
