
**2026.38.0 BETA**

**VR Overlay**

* Added a notification when a friend joins your instance.
* For example, when Shiny joins your instance, the overlay will display: **“Shiny joined your instance.”**
* Added Text-to-Speech support to the VR Overlay.
* You can choose which events should trigger a spoken notification, such as when a friend joins a world.

**Text-to-Speech**

* Added Text-to-Speech support to KikitanXD.
* KikitanXD can now speak the text that is sent to your OSC Chatbox.
* To let other players hear the generated voice, you need to route the audio through a virtual audio cable using software such as VoiceMeeter.
* Added SAPI Offline TTS
* Added Microsoft Neural Online TTS

**Fonts**

* Added various Google Fonts to VRCN.
* Added support for custom fonts installed on Windows.
* Font settings can be found under **Settings > Appearance > Fonts**.
* Added a font-size slider that allows you to increase or decrease the default font size by up to 5 px.

**Design Changes**

* Added badge counters to the left sidebar for favorite and owned worlds, joined groups, owned and favorited avatars, and events taking place during the current month.
* Added adjustable separators to better organize the left sidebar.
* Added an option to show separation lines between the taskbar and the left and right sidebars.
* Added an option to display certain tab elements inside cards, making them easier to navigate.
* Redesigned the **Appearance** tab and added theme previews.
* Replaced the favorite star icon with a heart icon.
* Updated the **Play VRChat** button in both the expanded and collapsed sidebar to match the VRCN v2 design.

**Improvements**

* The left and right sidebars can now be resized.
* Added **Lock Sidebars** under **Taskbar > View** to disable sidebar resizing.
* Added **Reset Sidebars** under **Taskbar > View** to restore their default sizes.
* Icons, symbols, and fonts are now stored locally instead of being downloaded from Google’s CDN.
* Fonts, icons, and symbols are now loaded dynamically, slightly reducing memory usage.

**Bug Fixes**

* Fixed an issue where profile frames were still displayed when the setting was disabled.
* Fixed column headers in Timeline lists not aligning with the content below them.
* Fixed copying images from the Photo Modal placing a local cache link on the clipboard instead of the actual image. Images can now be pasted directly into Discord, chats, and image editors.
* Fixed the heatmap in user profiles using the button color instead of the VRC+ icon color.
* Fixed an issue that prevented profile theme colors from being updated.
* Fixed the "Most visited World" progress bars on vrc+ decorated profiles.
* Fixed VRCNDb avatar ID searches using `avtr_...`.
* Fixed VRChat+ world favorite groups showing only 4 instead of 8 groups.
* Fixed the avatar favorite group picker not reopening after pressing Cancel.
* Fixed KikitanXD sending audio below the Gemini noise gate threshold, which could capture nearby players.
* Fixed SteamVR Overlay crashes caused by Space Flight.