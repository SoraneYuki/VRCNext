**2026.46.1**

**Create Groups**
* New **Create Group** button next to the filter bar in **Groups > My Groups**. Set name, short code, description, join state, privacy and role template, and pick an icon and banner from your VRChat inventory, using the same picker as Select Icon and Select Banner Photo.
* The modal shows a live preview of the group card while you type, so you can see how the group will look before creating it.
* Creating groups requires **VRChat+**. Without it VRCNext shows an error instead of sending the request, and any VRChat error is shown as well.

**Help/Support**
* New **Taskbar > Help > Export Debug Kit**. Pick a folder and VRCNext bundles the 5 newest crash logs, the 5 newest VRCNext logs and the 2 newest VRChat logs into `vrcn-log-dd-mm-yyyy.zip`, then opens the folder so the file is ready to attach to a bug report.

**Log Viewer**
* New **Taskbar > Tools > VRChat > Log Viewer**. Pick any of your VRChat log files and read them as a proper table with **Time**, **Level**, **Category** and **Message**.
* Level badges are colour coded and can be toggled with the **Debug**, **Warning** and **Error** checkboxes, and the category dropdown lets you narrow it down to the sources you care about.
* Search covers message, category and stack traces, with matches highlighted. Lines that belong to the entry above, such as stack traces, are folded into it and counted.
* Rows can be ticked, with a select all box in the header, and right clicking a row offers **Copy row**, **Copy message**, **Copy selected** and **Clear selected**. Copying gives you the original log text including stack traces, not the cleaned up display text.
* VRChat's colour markup is stripped, so a category like `<color="#B5438F">BilliardsModule</color>` shows up as plain **BilliardsModule** in the dropdown instead of a wall of tags.
* Very large logs are capped at the newest 2000 matching entries so the modal stays responsive, and the counter shows how many entries the file has in total.

**Message Templates**
* New **Taskbar > Tools > VRChat > Message Templates**. Edit all four sets of VRChat's canned messages in one place: Invite, Invite Response, Invite Request and Request Response, twelve slots each.
* Slots on cooldown are shown with the remaining minutes and cannot be edited, since VRChat locks a slot for 60 minutes after every change.

**Time Spent**
* New **Groups** tab next to Worlds and Persons. It shows how long you spent in each group's instances and how many times you joined them, with the same ranking, search and paging as the other two.
* All three group instance types count towards it: **Group**, **Group+** and **Group Public**.
* This starts collecting from now on. Group time was never stored before, only world time, so past sessions cannot be shown and the tab fills up as you play.

**FrameShot**
* FrameShot now scans the framed area for **QR codes** while you hold the frame. When one is found, the frame turns green, a sound plays and the detected target is shown inside the frame.
* Added a new **Accept / Open QR** keybind next to Frame, Record (GIF) and Record (Video). Pressing it opens the detected link in your normal browser, so it is already open when you take the headset off.
* Only http and https links can be opened. Other QR content is shown but never opened.
* FrameShot can also detect **stylised QR codes** with logos, rounded or dot-shaped modules, colors or inverted designs. These can take slightly longer to detect than normal QR codes.

**Custom Chatbox**
* Chatbox lines can now be reordered. Drag **Local Time**, **Now Playing**, **System Info** and **Custom Text** into any order, similar to the sidebar navigation editor.
* Custom text lines can now be edited instead of only deleted.
* Every custom text line now has its own on/off switch.
* Fixed 12-hour time formats not showing **AM/PM** on some system languages.
* **System Info** now has separate switches for **CPU**, **RAM**, **GPU** and **VRAM**.
* The AFK time next to the AFK message can now be disabled.

**Groups Tab**
* Added **Joined Group** and **Created At** columns to List View. Both can be sorted and reordered.
* These values are loaded from the local group cache after a group's modal has been opened, since VRChat does not provide them in the normal groups list.
* Added an **Edit** button. Edit Mode allows selecting multiple groups, using **Select All** and performing actions from a bar at the bottom.
* Added **Bulk Leave** to leave multiple selected groups at once, with a confirmation dialog first.

**Edit Mode**
* **My Avatars** and **My Worlds** now have an Edit button.
* Selected entries can be **Added to Favorites**, moved into a **Local Group** or deleted in bulk.
* **My Groups** now supports **Bulk Delete** alongside Bulk Leave.
* Bulk Delete only affects groups you own. Groups you only moderate are ignored.
* Every bulk delete shows a confirmation dialog listing what will be deleted.

**World, Avatar and Group Modals**
* Added **Delete World**, **Delete Avatar** and **Delete Group** directly to their modals.
* Delete Group is only available to the group owner. World and Avatar deletion is only available for content you uploaded yourself.
* Every delete action asks for confirmation and shows what is about to be deleted.

**Worlds Tab**
* Your own worlds can now be edited directly from the world modal, similar to avatars.
* You can edit the **Name**, **Description**, **Tags** and **World Image**.
* Editing tags only changes your own tags and keeps platform-owned tags such as approval information untouched.
* Edit Mode now shows **Select All**, **Move to...**, **Remove** and **Create Local Group** in a bar at the bottom.
* #165 Added **Published** and **Updated** columns to List View. They work in My Worlds, Favorites, Recently Visited and Search and can be sorted and reordered.

**Avatars Tab**
* Edit Mode now shows **Select All**, **Move to...**, **Remove** and **Create Local Group** in a bar at the bottom.
* #165 Added **Created At**, **Last Updated** and **Tags** columns to List View.
* The new columns work in My Avatars, Favorites, Recently Used, Rose Database and Search and can be sorted and reordered.

**People Tab**
* Edit Mode now shows **Select All**, **Move to...**, **Remove from Favorites** and **Create Local Group** in a bar at the bottom.
* Added **Bulk Unfriend** to unfriend multiple selected people at once, with a confirmation dialog first.
* Edit Mode now also works in **All Friends**. Selected friends can be added to a favorite group or unfriended in bulk.

**Translations**
* Korean Translation by @roshikeymusica
* Updated Traditional Chinese localization by @SoraneYuki

**User Profiles**
* **Friends** and **Groups** were moved into the Shared Connections search bar, putting search, tabs and sorting into one row.

**Messages**
* Redesigned the message list with cards to match the V2 design.
* The header now shows the number of open conversations.

**Notifications**
* Redesigned the notification center with cleaner cards for each notification.
* Notification types are now color coded for easier recognition.
* The header now shows the total number of notifications.
* Fixed notifications getting squished when many were shown. The list now scrolls properly.

**Design**
* Small color adjustments across all themes.

**Inventory**
* #65 You can now **upload prints** directly from the Prints tab.
* Uploaded prints use the same picker and preview as other inventory uploads.
* If you are currently in a world, the print is automatically tagged with that world and the capture time is saved.

**Fixed Bugs**
* Direct Access (Ctrl+D and context menu) now detects **VRChat IDs anywhere in copied text**, including API URLs, sentences and bare IDs.
* Direct Access now supports **events** and plain instance links like `wrld_xxx:12345~region(eu)`.
* Fixed the **People List View** jumping back to the left whenever friends or profile information updated.
* Fixed **Edit Mode** switching back to Grid View when enabled in List View. Selection now works properly in List View for Worlds, Avatars, Groups and People.
* Fixed deleted avatars still appearing in **My Avatars** after refreshing. Deleted avatars are now removed from the list and local cache immediately.
* Fixed deleted worlds still appearing in **My Worlds** after refreshing.
* Fixed the Friends sidebar search bar card separation.
* Fixed tools and startup apps with **Start with VR/Desktop** sometimes not starting again after VRChat was closed and restarted.
* Auto-start can no longer accidentally turn a running tool **off**.
* Failed auto-starts, for example while SteamVR is still starting, are now retried automatically.
* VR mode detection now briefly waits for SteamVR instead of incorrectly detecting Desktop mode during startup.
* **Close with VRChat** no longer closes copies of startup apps that were launched manually.
* Tool auto-start no longer depends on **Start always with VRChat**, which only applies to external startup apps.
* Fixed the edit pencil position on your own profile.
* Fixed an issue where the **FFC cache** did not refresh after avatars were added to or removed from My Avatars.
* Removed cell filtering visuals on seatch lists.
* Improved avatar submitting to VRCNDb. Avatar IDs are now also collected live from the VRChat log, including avatars that were blocked by your performance settings (AssetBundleDownloadManager), and sent in batches of 40 instead of only after a quiet period. The log that already exists when VRCNext starts is included.
* Fixed the friends sidebar showing **Online 0** and **No friends online** after being logged out. It now shows the login prompt again, and the red warning icon when collapsed.
* Fixed an issue when deleting a group it was still in the group list.