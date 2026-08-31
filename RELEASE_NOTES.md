**2026.47.5**

**Improvements**

* **Worlds**
  * There's a new **Comments** section in the world modal's Info tab. You can leave one comment per world, up to 256 characters, and delete your own anytime with the X that shows up on hover. Comments can be upvoted or downvoted, and inappropriate language, links and mean-spirited comments are filtered out automatically. You can turn comments off entirely under **Settings > Safety**.

* **My Profile**
  * The **Current Avatar** card now always shows up, same as on everyone else's profile.

* **Kikitan XD**
  * Added a **Use Silero VAD** option for **Local Models**. It checks for actual speech before sending audio off to Whisper, so you get way fewer bogus transcriptions from breathing, mouse clicks and background noise. You'll need the Silero VAD model for this.

* **Avatars**
  * Resolved avatars are now cached locally by image file ID. Anything we've seen before loads straight from disk instead of hitting avtrdb, avtr.icu or db.vrcnext.com. Cache entries get re-checked after 30 days.
  * Joining an instance now resolves everyone in one query per database, instead of one query per person repeated every 10 minutes for as long as you stick around.
  * If none of the databases know an avatar, we just ask VRChat directly. Private avatars will show their name now, with a lock icon next to it.

* **Instance**
  * New **Avatar** column in the People > Instance table and in the instance modal. It shows the avatar name and takes you to its page when clicked. Unknown ones get a lock instead.

**Bug Fixes**

* **Kikitan XD**
  * Fixed Voice Activity Detection not working with Local Models.
