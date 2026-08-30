**2026.47.4**

**Improvements**

* **My Profile**
  * always shows the **Current Avatar** card, like other profiles.

* **Kikitan XD**
  * new **Use Silero VAD** option for **Local Models**. Detects speech before sending audio to Whisper, cutting false transcriptions from breathing, clicks and background noise. Requires the Silero VAD model.

* **Avatars**
  * resolved avatars are cached locally, keyed by image file ID. Known avatars load from disk instead of querying avtrdb, avtr.icu or db.vrcnext.com. Re-checked after 30 days.
  * entering an instance resolves everyone in one collective query per database instead of one per person, repeated every 10 minutes while you stay.
  * if no database knows an avatar, VRChat is asked directly. Private avatars now show their name, marked with a lock icon.

* **Instance**
  * new **Avatar** column in the People > Instance table and the instance modal. Shows the avatar name and opens its page on click. Unknown avatars get a lock instead.

**Fixed Bugs**

* **Kikitan XD**
  * fixed Voice Activity Detection not working with Local Models.