**2026.41.13**

**Removed**

* Removed the **Navigation** tab from Settings.
* Removed the **Classic** modal design for Profile, World, Group, and Avatar modals.
* Removed the **Direct Modal Search** option, as it is now always enabled.

**Dashboard**

* Completely redesigned the Dashboard with the new **VRCN v2** style.
* Added customizable hero widgets for **Friends/Group Activity**, **Next Event**, and **VRChat News**.
* Added "Pins" Widget to hero widget section.
* Reworked **Edit Dashboard**. Widgets can now be added, removed, and reordered directly on the Dashboard.
* Added support for **2 widgets side by side**.
* Redesigned and improved most Dashboard widgets.
* Removed several outdated or redundant widgets.

**Groups**

* Added a new **Group Instances** tab showing active instances from all your groups.

**Performance**

* Improved memory cleanup to reduce VRCNext's RAM usage.
* **Memory Trim** is now enabled by default and runs every 15 minutes.
* The VR helper now only runs when needed, saving around **100 MB of RAM** when VR features are not being used.

**Modals**

* All detail modals for **Profile, World, Group, and Avatar** now always use the **Compact** layout.
* Modal actions and breadcrumb history now always appear in the bar at the top of the modal.
* Removed the old taskbar navigation mode and its related setup options.

**Fixes**

* Fixed the horizontal scroll position in **People > Instance** resetting during player list updates.
* Fixed **See All** on the **Friends Recent Activity** widget not switching to **Timeline > Friends**.
* **See All** on the **Group Activity** widget now opens **Groups > Group Instances**.
* Fixed an issue where timeline events on the Dashboard were not updating live and required a manual refresh.
* Fixed the activity widgets showing raw internal names such as `group.announcement` instead of proper labels, and status changes now show the old and new status again.
* Fixed missing right click context menus on **Friends Activity** and **Group Activity** items in the hero section.
* Fixed the header image disappearing from the **World** modal after opening a timeline event from it.
* Fixed an issue where timeline events on the Dashboard did not use localization keys for their text.
* Fixed an issue where timeline events did not show status dots.
* Fixed an issue where World modal banners could become corrupted when opening a timeline event from inside the modal.
* Fixed an bug on dashboard that caused context menu to no work anymore on friends activity and group activity hero widgets.