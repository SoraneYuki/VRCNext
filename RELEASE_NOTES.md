**2026.34.0**

**New / Changes**

* Added a **Customize Profile** button to your profile modal. Choose your owned VRC+ icon frame, nameplate decoration and profile effect, preview them, or set them to None.
* Added **VRC+ Decorations** settings under Settings > General. Icon frames, nameplates and profile effects can be enabled separately and are cached for faster loading after restarts.
* Added **Favorite** and **Unfavorite** buttons to Avatar Modals.
* Updated modal controls: Close now appears in the taskbar when Direct Modal Navigation is disabled. In Compact mode, banner editing uses a pen button directly on the banner.
* Added live typing for KikitanXD with Google Gemini. Transcribed text now appears in the OSC chatbox while speaking.

**Bug Fixes**

* Fixed VRCNDb avatar ID searches using `avtr_...`.
* Fixed VRChat+ world favorite groups showing only 4 instead of 8 groups.
* Fixed the avatar favorite group picker not reopening after pressing Cancel.
* Fixed KikitanXD sending audio below the Gemini noise gate threshold, which could capture nearby players.
* Fixed SteamVR Overlay crashes caused by Space Flight.
* Improved handling when the VR Overlay process stops. VRCNext remains open, but must be restarted after a VR runtime crash to restore the overlay.
