**2026.43.5**

**Media Library**
* Added **Tags** for photos and videos, including categories like Funny, Romantic, Meme, Friends, Games and more. Tags can be added from the photo modal or right click menu.
* Added **User Tags**. Right click anywhere on a photo and select **Create User Tag** to mark which friend is shown at that position.
* Added **Tags** and **User Tags** filters. They work together with Favorites, Rating, Friends, Worlds, Folders and Media Type.
* Tags and User Tags are saved permanently and remain after restarting VRCNext.

**Notifications**
* Made the notification center about 50% wider for better readability.
* Notifications now show their type, such as **Friend Request** or **Group Announcement**.
* Added **Clear all notifications** next to Refresh.
* Added **View all notifications**, which opens Timeline > Personal > Notifications.

**System Tray**
* Redesigned the tray menu to match the new sidebar and made it about 25% more compact.
* The tray now shows your full localized status, such as **"Ask Me - sleeping"**.
* Improved sharpness on high DPI and scaled displays.
* The tray menu now opens where you right click the tray icon.

**Design Refactor**
* Updated some base theme colors.

**Friends Sidebar**
* Added **Friends/Groups** buttons for easier switching between friends and groups.
* Redesigned the **Same Instance** section and removed the large world images to save some memory.
* Added **Separate Friends and Favorite Friends** under **Settings > Sidebar > Friends Sidebar**. When enabled, Friends, Favorites and Groups get their own tabs.

**Performance**
* Cached images are no longer unnecessarily reloaded on every startup.
* Fixed a world cache memory leak that could increase memory usage during long sessions.

**VR Overlay**
* Added a **Friend leaves your instance** notification with separate Show and TTS options.
* Added an **Invite Request** notification with separate Show and TTS options.

**Fixed Bugs**
* Friends under **Same Instance** no longer also appear under **In-Game**.
* Fixed a major memory leak in **Space Flight** and **FrameShot** that could cause several GB of extra memory usage during long sessions.
* Space Flight and FrameShot now correctly restore their status after a UI reload.
* Reduced unnecessary microphone meter updates in **Voice Fight** and **Kikitan XD**.
* Fixed the **Kikitan XD** noise gate slider briefly resetting the meter to zero.
* Fixed two **Media Library** scans sometimes starting at the same time and corrupting the photo size cache.
* Fixed backend messages sometimes being lost during app startup.
