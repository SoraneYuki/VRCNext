**2026.41.8**

**VR Overlay**

* Action Flow notifications now appear on the wrist overlay.
* Action Flow notifications now also appear as floating notification crumbs.

**Action Flow**

* Increased the maximum Action Blocks per flow from **10 to 20**.
* The server request limit remains **20 requests per 10 minutes** to prevent VRChat API spam.
* Instance Info webhooks now include the full instance and a direct **Join Instance** link.
* Instance messages now show the instance name, region, group, and player count.
* Notifications now use the **Flow Name** as their title instead of the generic "Action Flow".

**New Blocks**

* Added a new **Get Info** category with blocks for:

  * Current world
  * Current avatar
  * Instance name and ID
  * Player count and player list
  * Friends currently in-game
  * Current time
  * Player that triggered the flow
* Get Info blocks use already available VRCNext data and make **no additional VRChat API requests**.
* Added **Switch to Avatar by ID**.
* Added **Set Current World as Home World**.
* Notification blocks can now include values from Get Info blocks, for example `Joined: <player name>`.
* Added **Close VRChat**, allowing flows to automatically close the game without using the VRChat API.

**Deep Links**

* Added `vrcn://instance/<location>` to open instance details in VRCNext.
* Added `vrcn://instance-join/<location>` to open the instance launch dialog.
* VRCNext can launch VRChat directly into the instance when the game is closed or offer a self invite when it is already running.

**Fixed Bugs**

* Fixed the platform filter not working under **Avatars > Recently Used**.
* Fixed missing platform icons on recently used avatar cards.
* Fixed **Create & Join** only sending a self invite when VRChat was closed. It now launches directly into the new instance.
* Fixed #150 Action Flow sometimes reporting an empty instance shortly after changing worlds.
* Fixed Avatar Search incorrectly showing every avatar as deleted while signed out.

**Security**

*Linux Only*

* Fixed #146 where VRChat credentials on Linux were not properly encrypted.
* VRChat passwords, auth cookies, and 2FA cookies are now encrypted using **AES-256-GCM**.
* Encryption keys are stored separately and protected from simply being copied to another machine.
* Existing logins continue to work and old credentials are automatically upgraded.
* Windows continues to use **DPAPI** for credential storage.
