**2026.41.8**

**VR Overlay**

- Shows now Action Flow notifications on the wrist overlay.
- Shows now Action Flow notifications on the floaty notify crumbs.

**Action Flow**

- Changed action block limit from 10 to 20 action blocks per flow max. Please keep in mind the server request limit remains 20 per 10 minutes window to prevent any VRChat API spam.
- #145 Instance info webhooks now carry the full instance instead of only the world. The embed title and a new **Join Instance** link both lead straight into the instance.
- Messages now include the instance name, region, group name and player count. Player count is new for friend instance info, it was previously only sent for your own instance.
- Applies to all three blocks: own instance info, own advanced instance info and friend instance info.
- Notifications now use the flow name as their title instead of a generic "Action Flow", in VR as well as in the desktop notification.

*New blocks*

- New **Get Info** category. Every block returns text you can plug into a notification: current world name, avatar name, instance name, instance ID, player count, player list, friends in game, current time and the name of the player that triggered the flow.
- Get Info costs nothing. Every block reads data VRCNext already holds, so it never adds a single VRChat API request.
- **Actions > switch to avatar** takes an avatar ID directly, so you no longer have to pick from your own or favorite avatars.
- **Actions > set current world as home world** sets the world you are in as your home world.
- **Actions > send notification** now also accepts a Get Info block, and **send advanced notification** combines your own text with one, for example `Joined: <joined player name>`.
- **Game > close VRChat** closes the game, useful for shutting down after a while. It uses no VRChat API call and does not count towards the request limit.

**Deep Links**

- Added `vrcn://instance/<location>` which opens the instance details inside VRCNext.
- Added `vrcn://instance-join/<location>` which opens the launch dialog. It launches VRChat into the instance while the game is closed and offers a self invite once it is running.

**Fixed Bugs**

- Fixed the platform filter having no effect under Avatars > Recently Used.
- Fixed platform icons missing on cards under Avatars > Recently Used. Both were caused by cached avatars not carrying their platform data.
- Fixed **Create & Join** only sending a self invite while VRChat was closed. It now launches VRChat straight into the new instance.
- Fixed #150 Action Flow reporting an empty instance when a flow ran shortly after a world switch. It now waits until the player list has settled.
- Fixed avatar search falsely reporting every avatar as deleted while signed out of VRChat. No availability checks run without an active session.

**Security**
*Linux Only*

- Fixed #146 where VRChat credentials on Linux were not properly encrypted and could be easily decoded from `settings.json`.
- Linux now securely encrypts your VRChat password, auth cookie, and 2FA cookie using AES-256-GCM.
- Encryption keys are stored separately and protected so copied settings cannot simply be used on another machine.
- Existing logins continue to work and old credentials are automatically upgraded to the new encryption.
- Windows continues to use DPAPI for secure credential storage.