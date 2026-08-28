**2026.47.1**

**Custom Chatbox**
* **AFK** no longer triggers the moment you leave VRChat. It now waits until the mouse and the keyboard have both been idle, with a separate timer for each under **AFK Settings**, 10 seconds by default.
* **Format > Separator** now has a **Custom** option: write your own chatbox layout in a text field. Each line becomes a chatbox line, and you control the order and separators.
* Placeholders: `[time]`, `[playing]`, `[system]`, `[heart]`, `[weather]`, `[window]`, `[custom text]`. Empty placeholders remove their separator too, so no dangling pipes.
* New **Weather** module: enter your city, pick °C or °F, and get the current temperature with an icon. No account or API key needed (Open-Meteo, refreshes every 10 min).
* New **Window Activity** module: shows your focused app, e.g. `On desktop "Visual Studio Code"`.
* New **Heart Rate** module via **HypeRate**: install the free app on a watch, phone or supported chest strap, enter your ID, and your live BPM shows in VRChat. Format it with `{bpm}`, reorder and toggle it like any other line. It reconnects automatically and hides itself after a minute without a reading, so no stale numbers.
* Modules with sub-settings (Now Playing, System Info, Heart Rate, Weather, Window Activity, AFK Detection) can now be collapsed. **AFK Settings** moved out of its own card into that dropdown.
* Chatbox lines now have icons matching MagicChatbox: thought bubble, heart, window, and a weather icon that follows current conditions.

**Improvements**
* **Ctrl + D** and right-click **Open Profile** now support **legacy user IDs** (e.g. `https://vrchat.com/home/user/qYZJsbJRqA` or just `qYZJsbJRqA`).

**VRCNDB**
* Added **Sync Likes** (**Avatar Search > Support**): your favorited avatars count as likes on the community database, helping surface popular avatars. Anonymous, on by default, syncs at startup and when you add a favorite, and submits avatars missing from the database.
* Added **Sync Wears**: wearing an avatar counts toward its wear count, so the site can show what's actually being worn. Also anonymous and on by default.

**Fixed**
* While **AFK** the chatbox no longer glues the clock and the separator in front of your message. With the new **Custom** separator this even printed the literal word "custom", as in `12:00 PMcustomIm afk (5m)`. AFK now shows only your message and its timer.
* **Joined/left player image** blocks in **Action Flow** now work. Previously only the friend's icon block counted as an image, so those two were dropped from notification cards, tray notifications, the VR overlay and Discord webhooks.