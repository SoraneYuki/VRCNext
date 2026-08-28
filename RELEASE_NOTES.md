**2026.47.2**

**Timeline**
* **Personal > Notifications** are now colour coded so you can tell them apart at a glance: friend requests are green, anything group related is orange, world invites and their responses are cyan, and everything else stays yellow.

**Fixed**
* **Taskbar > Notifications**: none of the buttons worked. **Current**, **Hidden** and **Refresh** did nothing at all, and **Clear All**, **Accept**, **Hide** and the quick replies never reached VRChat. All of them work again.
* **Tools > Chatbox** stopped sending messages on PCs that had been running for more than 25 days without a restart (sleep and Fast Startup count towards that). Now fixed.
* **Security**: a website open in your browser could ask the local media server for any file on your disk, and file paths weren't properly restricted to their folders. Background images now come from a fixed list, every route is locked to its own folder, and only VRCNext itself can access the server.
* **Friends**: friend locations, names and GPS status were updated from several places at once, which could silently drop location updates or leave friend info in a broken state. Fixed.
* **Settings**: if VRCNext crashed or your PC lost power while settings were being saved, the file could end up damaged. VRCNext would then start with default settings and overwrite the file, losing all your settings and accounts. Saving is now safe against interruptions, and a backup copy is kept and used automatically if the main file can't be read.
* **VRChat log**: a line VRChat was still writing could be read too early, producing join events without a user ID. Only completed lines are read now.
* **Timeline**: cached world thumbnails used the wrong time reference when deciding what was older than seven days, so the cutoff shifted by your timezone.
* **HypeRate**: changing the device ID could leave the UI showing "not connected" even though heart rate data was coming in.