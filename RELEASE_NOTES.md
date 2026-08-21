**2026.43.5**

**Performance**
* Cached images are no longer reloaded on every app start, which makes startup lighter.
* Fixed a memory leak in the world cache that made memory usage grow steadily during long sessions.

**VR Overlay**
* Added a **Friend leaves your instance** notification under **Overlay Notifications**, with its own Show and TTS toggles. Leaving a world yourself does not count as your friends leaving.
* Added an **Invite Request** notification under **Overlay Notifications**, shown when someone asks you for an invite. Also has Show and TTS toggles.

**Fixed Bugs**
* Fixed a memory leak in **Space Flight** and **FrameShot** that could cause several GB of extra memory usage during long sessions.
* Space Flight and FrameShot now correctly restore their status after a UI reload.
* Reduced unnecessary microphone meter updates in **Voice Fight** and **Kikitan XD**.
* Fixed the **Kikitan XD** noise gate slider briefly resetting the meter to zero.
