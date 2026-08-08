**2026.41.0**

**Wiki**
* Added "Wiki" button to Taskbar > Help > Wiki

**People Tab**
* Added grid and list views to **Favorites** and **All Friends**.
* The list view now shows more information, including Profile, Username, Trust Rank, Status, Language, Bio Links, Meets, Date Joined, Last Login, and more.
* Added sorting and filtering options when using list view.
* Added **Time Spent** and **Pronouns** columns to the list view.

**Worlds Tab**
* Added a list view to **Favorites** and **My Worlds**, showing World, Name, Visits, Time Spent, and Last Visited.

**Groups Tab**
* Added a list view to **Joined**, **My Groups**, and **Moderated Groups**, showing Group, Name, Short Name, and Member Count.

**Avatars Tab**
* Added a list view to **My Avatars** and **Favorites**, showing Avatar, Name, Creator, Status, and PC, Android, and iOS performance ranks.
* Added "Fetch" button that fetches all friends information with a cooldown of 1 hour. This fetches all data from friends and also updates the mutual network structure.

**Improvements**
* Avatar, World, People, Groups, Inventory, Media Library, and several other tabs now have a fixed navigation card that no longer scrolls with the content, making navigation easier at the cost of a small amount of screen space.
* When clicking an avatar it wont immedically use that avatar anymore. instead an modal opens that ask you if you really want to use this avatar or if you want to open the avatar informations modal.

**i18n**
* Added missing loc. keys for various ui elements.
* Added missing translation for the new sidebar.
* Added missing translation for some other ui elements.

**Fixed Bugs**
* Fixed an issue that caused VRCX database imports to fail when the database was larger than 200 MB.
* Fixed an issue that could cause VRCN to crash when using more than 256 MB of memory.
* Fixed a garbage collection issue that prevented unloaded pages from being properly cleaned up.
* Fixed an issue that could cause VRCN to crash when using the Avatar Search tab.
* Fixed an issue where VRCNDb filters did not work correctly when using VRCNDb in Avatar Search.
