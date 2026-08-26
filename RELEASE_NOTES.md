**2026.46.7**

**Action Flow**
* New **wait for** and **wait until** blocks under **Logic**. Both are C shaped with a **then do** branch.
* **wait for** takes a number block and runs its branch after that many seconds. **wait until** takes a condition plus a **true/false** block and runs its branch as soon as the condition matches, checking once per second.
* Blocks placed below a wait keep running right away, so a wait never blocks the rest of the flow. Each block can only have one wait pending at a time, and pending waits are dropped when the flow is edited, disabled or deleted.
* New **set OSC bool**, **set OSC float** and **set OSC integer** blocks under **VRCN Actions**. Enter a parameter name or pick one detected by the **OSC Tool** for your current avatar.
* Parameter names are sent as avatar parameters. Paths starting with / are sent unchanged, allowing custom addresses such as `/input/Jump` or `/chatbox/typing`. Values use the **true/false** and **number** blocks from **Logic**.
* #147 New **is favorite (group) friend** block under **Friends**. Check whether a user is part of one of your VRChat favorite groups or VRCNext local groups.
* New **set feature** block under **VRCN Actions**. Pick a VRCNext feature and set it to true or false, allowing flows and conditions to control features automatically.
* Supports **VR Overlay**, **KikitanXD**, **YouTube Fix**, **Discord Presence**, **Voice Fight**, **FrameShot**, **Space Flight**, **Custom Chatbox**, **Media Relay**, **Status Schedule** and **Event Snipe**.
* Features already in the requested state are left unchanged.
* Renamed toolbox categories: **Actions** is now **VRC Actions** and **Other Actions** is now **Webhook Actions**.
* #153 New **send to webhook** blocks under **Webhook Actions** for sending custom text or **Get Info** values to Discord webhooks.
* Three variants are available: custom text, a **Get Info** value, or custom text followed by that value.

**Space Turn**
* New **Space Turn** tool under **Tools > VR Tools**, modeled after Space Turn in OVR Advanced Settings. Hold the configured controller button and twist your hand to rotate your SteamVR playspace. The world pivots around your headset, so you stay in place.
* Settings for **Turn Multiplier**, an **Invert direction** toggle, a **Smoothing** slider (0 keeps the raw controller signal, 100 filters out most jitter) and a **Comfort Mode** that rotates in fixed steps (15, 30, 45 or 90 degrees) instead of smoothly.
* Uses the same per-hand keybind setup as **Space Flight**, including the SteamVR (Index) input mode, and can start automatically when launching VRChat in VR.
* Space Turn and Space Flight share the same playspace, so dragging and turning can be used together. The Space Flight reset only clears the position and the Space Turn reset only clears the rotation, so one tool never undoes the other.
* Space Turn is available as a toggle in the **VR Overlay** tools tab and as a feature in the Action Flow **set feature** block.

**Changes**
* Reduced the gap between toolbar rows in **Worlds**, **People**, **Groups**, **Avatars**, **Timeline** and **Time Spent** for more consistent spacing.

**Improvements**
* #169 Improved grammar and wording in the Traditional Chinese localization by @SoraneYuki.

**Fixed Bugs**
* Fixed **Space Flight** jumping one to two metres on the first drag after a reset. When a controller pose was momentarily invalid, the grab anchored on the tracking origin instead, so the next valid frame moved you by the full distance to your controller. Grabs now wait for a valid pose.
* #171 The **minimize**, **maximize** and **close** buttons no longer get cut off in narrow windows. Other toolbar elements now shrink first to keep the window controls accessible.
* Fixed severe performance drops while the **OSC Tool** was connected. OSC updates are now grouped instead of updating the interface for every value individually, and no interface updates are processed while the OSC tab is closed.
* #170 Fixed **Remember window size** not restoring maximized windows. The maximized state is now remembered alongside the previous window size and position.
* Fixed blank space above the header row in the **Timeline** list view.
* Made the **Group**, **Profile**, **Avatar** and **World** image columns easier to grab when reordering columns, including **Profile** in both Timeline list views.
* Fixed the Linux build crashing when selecting a database for the **VRCX** import. The file picker was opened from a background thread, which GTK does not allow. It now runs on the main thread like every other file picker.
