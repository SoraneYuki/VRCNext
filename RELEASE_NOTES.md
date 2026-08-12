**2026.41.8**

**Fixed Bugs**

* Fixed the platform filter having no effect under Avatars > Recently Used.
* Fixed platform icons missing on cards under Avatars > Recently Used. Both were caused by cached avatars not carrying their platform data.
* Fixed **Create & Join** only sending a self invite while VRChat was closed. It now launches VRChat straight into the new instance.
* Fixed #150 Action Flow reporting an empty instance when a flow ran shortly after a world switch. It now waits until the player list has settled.
* Fixed avatar search falsely reporting every avatar as deleted while signed out of VRChat. No availability checks run without an active session.
