**2026.46.11**

**VRCNDB**
**New Features**
* Added **Sync Likes** to the **VRCNDb Community Database** settings (**Avatar Search** > **Support**). When enabled, your **favorited avatars** (local and VRChat groups) count as a **like** on the community database, which helps show which avatars are popular. It is **completely anonymous**, **opt-out** (on by default), syncs on every startup and whenever you add a favorite, and submits avatars that are not in the database yet.
* Added **Sync Wears** in the same panel. When enabled, **wearing an avatar** counts toward its **wear** count on VRCNDb, so the site can show which avatars are actually worn and trending. Also **completely anonymous** and **opt-out** (on by default).
* Let WS add wear counts.

**Fixed Bugs**
* Fixed the **joined player image** and **left player image** blocks in **Action Flow** not showing up. Only the **friend's icon** block was recognised as a picture, so the two player image blocks were dropped from the message entirely, in the notification card, the system tray notification, the VR overlay and the Discord webhook.