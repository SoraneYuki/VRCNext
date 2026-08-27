**2026.46.9**

**Fixed Bugs**
* Fixed the **joined player image** and **left player image** blocks in **Action Flow** not showing up. Only the **friend's icon** block was recognised as a picture, so the two player image blocks were dropped from the message entirely, in the notification card, the system tray notification, the VR overlay and the Discord webhook.

**2026.46.8**

**Improvements**
* Resolving a world now also stores its full details in the local database, so description, tags, capacity, visits, favorites and occupants are already there the first time you open that world.

**Fixed Bugs**
* Fixed **Media Library > All Worlds** showing raw world IDs without a picture for most entries. Only the first 30 worlds were ever looked up and the rest were dropped. All worlds are now resolved in batches, and the filter list fills in as the names arrive.