**2026.41.11**

**UI Changes**
* Updated the **VRChat Config** modal.
* Updated the **VRChat Launch Options** modal.
* Updated the **Edit Dashboard** modal.
* Updated the **Edit Navbar** modal.
* Updated the **Change Status** modal.
* Updated sidebar colors, inputs, and refresh buttons.
* Media Library cards now show file size, resolution, and rating in a single line separated by dots, for example **4.2 MB · HD · ♥ 3x**. The rating is only shown when one is set.
* Removed the SD/HD/2K/4K/8K badges from Media Library cards.

**Performance**
* Added **Settings > General > VRC+ Decorations > Optimize VRC+ Usage**. This is enabled by default. Animated VRC+ decorations, such as icon frames and nameplates, are shown as static images in friend lists and cards. Animations still play in profile modals and on your own profile in the sidebar. A single animated decoration can use over 200 MB of RAM while playing, so this greatly reduces memory and GPU usage for users with decorations enabled. Disable the setting to keep animations enabled everywhere.
* Friend cards in the sidebar are now completely skipped by the renderer while they are outside the visible area.

**Changes**
* **Use Direct Modal Navigation** is now enabled by default on clean installs.
* Moved the clock from the left sidebar to the taskbar.
* Moved the **Other** card from Appearance to **Sidebar** and renamed it to **Taskbar**.
* Small adjustments in "Activity Log" tab for better responsive design.

**Removed**
* Removed **Additional Options** from Appearance.
* Removed the clock from the sidebar.
* Removed the **AM/PM** toggle. The time format now follows your system settings.
* Removed the **Use Trusted Rank Color instead of Badge** setting. Trusted users will now always use the Trusted rank color for their username. This reduces unnecessary settings and makes the UI easier to maintain.
