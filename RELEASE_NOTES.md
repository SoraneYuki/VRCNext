**2026.46.5**

**Action Flow**
* New **set feature** block under **VRCN Actions**. Pick a VRCNext feature and set it to true or false, allowing flows and conditions to control features automatically.
* Supports **VR Overlay**, **KikitanXD**, **YouTube Fix**, **Discord Presence**, **Voice Fight**, **FrameShot**, **Space Flight**, **Custom Chatbox**, **Media Relay**, **Status Schedule** and **Event Snipe**.
* The block checks the current state first, so nothing happens if the feature is already in the requested state.
* Renamed toolbox categories: **Actions** is now **VRC Actions** and **Other Actions** is now **Webhook Actions**.
* #153 New **send to webhook** blocks under **Webhook Actions**. They work like send notification blocks but send to a Discord webhook, making them useful for long term logging.
* Three variants are available: custom text, the value from a **Get Info** block, or custom text followed by that value.

**Changes**
* Reduced the gap between the two toolbar rows in **Worlds**, **People**, **Groups**, **Avatars**, **Timeline** and **Time Spent** for more consistent spacing.

**Fixed Bugs**
* #170 Fixed **Remember window size** not restoring maximized windows. VRCNext now remembers the maximized state as well as the previous window size and position.
* Fixed the blank space above the header row in the **Timeline** list view.
* Made the **Group**, **Profile**, **Avatar** and **World** image columns easier to grab when reordering columns, including **Profile** in both Timeline list views.
