**2026.44.9**

**FrameShot**
* FrameShot now scans the framed area for **QR codes** while you hold the frame. When one is found the
frame border turns green, a sound plays and the target is shown as a banner inside the frame.
* New **Accept / Open QR** keybind next to Frame, Record (GIF) and Record (Video). Pressing it opens the
detected link in your normal browser, so it is already open when you take the headset off. Photo and
cancel keep working exactly as before.
* Only http and https links can be opened. Any other QR content is shown but never opened.
* Also reads **stylised QR codes**: with a logo in the middle, rounded or dot shaped modules, coloured
or inverted (light on dark). Those need a bit more work, so they are checked on every third scan pass
and can take up to about a second longer to show up than a plain black and white code.

**Custom Chatbox**
* The order of the chatbox lines can be changed. Drag **Local Time**, **Now Playing**, **System Info**
and **Custom Text** into any order, the same way the sidebar navigation editor works. Song Playtime
stays attached to Now Playing.
* Custom text lines can now be edited afterwards instead of only deleted.
* Every custom text line has its own on/off switch, so a line can be parked without losing it.
* Fixed the 12 hour time formats never showing **AM/PM**. The designator was rendered in the system
language, and several languages (German among them) define it as empty, which silently dropped it.
* **System Info** now has its own sub switches for **CPU**, **RAM**, **GPU** and **VRAM**.
* The AFK time next to the AFK message can now be switched off.

**Groups Tab**
* Added an **Edit** button. In edit mode you can select multiple groups, with **Select All** and the
actions in a bar at the bottom of the tab.
* Added **Bulk Leave**: leave every selected group at once. A confirmation dialog lists the groups
first, since leaving cannot be undone.

**World, Avatar and Group Modals**
* Added **Delete World**, **Delete Avatar** and **Delete Group**. The action sits in the modal header
and its icon is shown in red so it never gets mixed up with the ones next to it.
* Delete Group is only offered to the group owner, the other two only for content you uploaded yourself.
* Every one of them asks first, in a dialog that names what is about to be deleted.

**Worlds Tab**
* Your own worlds can be edited straight from the world modal, the same way avatars already work:
**Name**, **Description**, **Tags** and the **World Image**. The pencil next to each section opens an
inline editor, the pencil on the banner replaces the image.
* Editing tags only touches your own tags. Everything the platform owns, like the approval flag, is
sent back untouched so an edit cannot strip a world's approval.
* Edit mode now shows **Select All**, **Move to...**, **Remove** and **Create Local Group** in a bar at
the bottom of the tab, the same way the media library does. The filter buttons stay visible while editing.
* #165 The list view has two new columns: **Published** and **Updated**. They work in My Worlds, Favorites,
Recently Visited and Search, and can be sorted and reordered like every other column.

**Avatars Tab**
* Edit mode now shows **Select All**, **Move to...**, **Remove** and **Create Local Group** in a bar at
the bottom of the tab. The filter buttons stay visible while editing.
* #165 The list view has three new columns: **Created At**, **Last Updated** and **Tags**. They work in
My Avatars, Favorites, Recently Used, Rose Database and Search, and can be sorted and reordered
like every other column.

**People Tab**
* Edit mode now shows **Select All**, **Move to...**, **Remove from Favorites** and **Create Local Group**
in a bar at the bottom of the tab. The filter buttons stay visible while editing.
* Added **Bulk Unfriend**: unfriend every selected person at once, with a confirmation dialog that
lists them first.
* Edit mode also works in **All Friends** now. There you can select people and either **Add to Favorites**
(pick the favorite group from the dropdown) or **Bulk Unfriend** them.

**Translations**
* Korean Translation by @roshikeymusica
* Update Traditional Chinese localization by @SoraneYuki

**User Profiles**
* **Friends** and **Groups** moved into the search bar of Shared Connections, so search, both tabs
and the sort dropdown now sit in one row.

**Messages**
* Redesigned the message list with cards to match the V2 design.
* The header now shows the number of open conversations.

**Notifications**
* Redesigned the notification center with cleaner cards for each notification.
* Notification types are now color coded for easier recognition.
* The header now shows the total number of notifications.
* Fixed notifications getting squished when many were shown. The list now scrolls properly.

**Design**
* Small color adjustments on all themes.

**Fixed Bugs**
* Fixed friends sidebar searchbar card seperation.
* Fixed tools and startup apps with **Start with VR/Desktop** sometimes not starting again after VRChat was closed and restarted, for example after killing a stuck VRChat from the SteamVR dashboard. VRChat restarts are now detected reliably, no matter how VRChat was started or stopped.
* Auto-start can no longer accidentally turn a tool **off** when it was still running.
* Failed auto-starts (for example while SteamVR is still starting up) are now retried automatically instead of silently giving up.
* VR mode detection at VRChat start now waits briefly for SteamVR instead of guessing Desktop mode too early.
* **Close with VRChat** no longer closes copies of a startup app that you started manually yourself.
* Tool auto-start no longer depends on the **Start always with VRChat** setting, which only applies to external startup apps as described.
* Fixed edit pen position on own profiles.
* Fixed an bug that caused FFC cache to not refresh avatars that were deleted/added to the my avatar section.