**2026.46.5**

**Action Flow**
* New **set OSC bool**, **set OSC float** and **set OSC integer** blocks under **VRCN Actions**. Type a parameter name or pick one from the dropdown, which lists the parameters the **OSC Tool** found for your current avatar.
* A plain name is sent as an avatar parameter, while a path starting with / is sent unchanged, so custom VRChat addresses such as `/input/Jump` or `/chatbox/typing` work as well. Values come from the **true/false** and **number** blocks in **Logic**.
* #147 New **is favorite (group) friend** block under **Friends**. Attach a user and pick a favorite friend group to check whether that user is in it.
* The dropdown lists your VRChat favorite groups and your VRCNext local groups, with local ones marked.
* New **set feature** block under **VRCN Actions**. Pick a VRCNext feature and plug in a **true/false** block from **Logic**, allowing flows and conditions to control features automatically.
* Supports **VR Overlay**, **KikitanXD**, **YouTube Fix**, **Discord Presence**, **Voice Fight**, **FrameShot**, **Space Flight**, **Custom Chatbox**, **Media Relay**, **Status Schedule** and **Event Snipe**.
* The block checks the current state first, so nothing happens if the feature is already in the requested state.
* Renamed toolbox categories: **Actions** is now **VRC Actions** and **Other Actions** is now **Webhook Actions**.
* #153 New **send to webhook** blocks under **Webhook Actions**. They work like send notification blocks but send to a Discord webhook, making them useful for long term logging.
* Three variants are available: custom text, the value from a **Get Info** block, or custom text followed by that value.

**Changes**
* Reduced the gap between the two toolbar rows in **Worlds**, **People**, **Groups**, **Avatars**, **Timeline** and **Time Spent** for more consistent spacing.

**Fixed Bugs**
* Fixed the whole app dropping to a few frames per second while the **OSC Tool** was connected. VRChat streams avatar parameters continuously, and every single value was forwarded to the interface on its own. Updates are now collected and applied as one batch, keeping only the newest value per parameter, and no interface work happens at all while the OSC tab is closed.
* #170 Fixed **Remember window size** not restoring maximized windows. VRCNext now remembers the maximized state as well as the previous window size and position.
* Fixed the blank space above the header row in the **Timeline** list view.
* Made the **Group**, **Profile**, **Avatar** and **World** image columns easier to grab when reordering columns, including **Profile** in both Timeline list views.
