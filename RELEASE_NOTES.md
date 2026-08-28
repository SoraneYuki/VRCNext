**2026.47.2**

**Timeline**

**Changed**
* **Personal > Notifications** are now colour coded with three distinct icons: friend requests are green, anything group related is orange, world invites and invite responses are cyan, everything else stays yellow.

**Fixed**
* **Taskbar > Notifications**: **Current**, **Hidden** and **Refresh** did nothing and never reached VRChat. All seven notification actions fell through into the VRChat log file handler, which also broke **Clear All**, **Accept**, **Hide** and the respond messages.