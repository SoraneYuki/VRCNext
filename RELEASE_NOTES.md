**2026.35.1**

2026.35.0 BETA -> 2026.35.1 STABLE

**VRChat Plus Decorations**
* Added a **Customize Profile** button to your profile modal. Choose your owned VRC+ icon frame, nameplate decoration and profile effect, preview them, or set them to None.
* Added **VRC+ Decorations** settings under Settings > General. Icon frames, nameplates and profile effects can be enabled separately and are cached for faster loading after restarts.
* Added VRC+ Background picker to profiles
* Added VRC+ Backgrounds to User Modals, Profile Previews.

**Pins**
* Added the new **Pins** feature. Right-click avatars, users, worlds, groups, events, features, or settings and select **Add to Pins**.
* Your saved pins can be found in the taskbar next to **Tools** and are displayed in a convenient list.
* You can currently save up to 10 pins.

**KikitanXD**
* Added ML to Gemini Transcription Model
* Added Live typing (send while speaking)

**Group Logs**
* Added group logs to the group modal. If you have permission to view a group’s logs, you can now see who joined or left the group, as well as moderation actions.

**Status Schedule**
* Added the new **Status Schedule** tool. This was already possible through Action Flow, but since many people are unfamiliar with Google Blockly or Scratch, we wanted to provide a simpler option.
* Create multiple rules to automatically change your status on specific days and at specific times.
* Added "Only on outside game" "Only while in-game" conditions.

**Updates / Changes**
* Updated the boop mechanic. You can now choose from all 65 default boop emojis.
* Added support for sending custom emojis as boops.
* Received boops now show the emoji that was sent instead of a generic heart.
* Updated the calendar so multi-day events appear as a single bar spanning all affected days.
* Moved several tools from the **Tools** dropdown in the taskbar to easier-to-find locations. Added **VR Tools** and **Automation** submenus.
* The world filter row now uses the same segmented control as the tabs in the profile modal.

**Bug Fixes**
* Fixed the weekday labels above the calendar being shifted by one day for everyone in a timezone west of UTC. June 1st 2026 now correctly reads Monday instead of Sunday. Users on or east of UTC were never affected, which is why this went unnoticed for a while.
* Fixed the same shifted weekday labels in the online activity heatmap and in the world modal.
* Calendar events no longer appear one day off and now use your local time.
* Fixed the ESC key not closing several modals, among them Leave Group, Friend Invite, Notification Response, Inventory Upload and the Media Library delete dialogs.
* Fixed a bug that caused user profile memos not to be shown after reopening the same profile again. Memos were never lost, they were only missing from the cached profile view.
* Fixed the world filter buttons losing their layout after leaving edit mode.
* Fixed VRCNDb avatar ID searches using `avtr_...`.
* Fixed VRChat+ world favorite groups showing only 4 instead of 8 groups.
* Fixed the avatar favorite group picker not reopening after pressing Cancel.
* Fixed KikitanXD sending audio below the Gemini noise gate threshold, which could capture nearby players.
* Fixed SteamVR Overlay crashes caused by Space Flight.
* Improved handling when the VR Overlay process stops. VRCNext remains open, but must be restarted after a VR runtime crash to restore the overlay.
* Fixed some VRC+ Decoration related issues on profile modals and profile previews.
