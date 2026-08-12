**2026.41.8**

**Fixed Bugs**

* Fixed the platform filter having no effect under Avatars > Recently Used.
* Fixed platform icons missing on cards under Avatars > Recently Used. Both were caused by cached avatars not carrying their platform data.
* Fixed **Create & Join** only sending a self invite while VRChat was closed. It now launches VRChat straight into the new instance.
* Fixed #150 Action Flow reporting an empty instance when a flow ran shortly after a world switch. It now waits until the player list has settled.
* Fixed avatar search falsely reporting every avatar as deleted while signed out of VRChat. No availability checks run without an active session.

**Security**
*Linux Only*
* Fixed #146 where VRChat credentials on Linux were not properly encrypted and could be easily decoded from `settings.json`.
* Linux now securely encrypts your VRChat password, auth cookie, and 2FA cookie using AES-256-GCM.
* Encryption keys are stored separately and protected so copied settings cannot simply be used on another machine.
* Existing logins continue to work and old credentials are automatically upgraded to the new encryption.
* Windows continues to use DPAPI for secure credential storage.