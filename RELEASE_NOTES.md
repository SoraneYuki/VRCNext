**2026.42.6**

**Avatar And World Imports**

* Imports now accept **JSON** and **TXT** files next to CSV.
* Avatar and world IDs are detected anywhere in the file, including inside links, so exports from other tools usually work as they are.
* Group names are picked up automatically where possible: headings in a text file, object keys or name fields in a JSON. Everything else lands in one untitled group.
* You still assign every group to one of your favorite groups yourself before importing, and anything left on Skip is ignored.
* Deleted and private avatars and worlds are now checked before importing and skipped, so your favorites no longer fill up with unusable "Unnamed / Private" entries. Your own private uploads are still imported.
* The result message now tells you how many entries were skipped.

**Kikitan XD 2.0**

* Added **Local Models**. Kikitan can now run fully on your PC without an API key or rate limits.
* Added a model manager for downloading and removing **Whisper** speech models and **Qwen2.5** translation models.
* Local models use **Vulkan** and support NVIDIA, AMD, and Intel GPUs without requiring CUDA.
* Local models are fully unloaded from RAM and VRAM when Kikitan stops.
* Model and source language changes now apply instantly while Kikitan is running.
* **Live Typing** now works with local models when translation is disabled.
* Added **Disable Non-Speech Elements** to hide Whisper outputs such as "(laughs)" or "(coughing)". Enabled by default.
* Updated the Groq translation model to **qwen/qwen3.6-27b**.
* Redesigned the Kikitan layout and moved **Personality** into the new **Settings** section.
* Added chatbox notifications on finals so other players know that you said something.

**Interface**
* Replaced the remaining browser popups with proper VRCN modals. Removing an account, deleting the VRChat asset cache, and creating, renaming or deleting Action Flows and conditions now use the same in-app dialogs as the rest of VRCNext.

**Fixed Bugs**
* Fixed Kikitan XD not working anymore with old groq models.
* Fixed an bug where some uninstall/Deletion modals are missing.