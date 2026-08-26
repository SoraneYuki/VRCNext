**2026.46.5**

**Action Flow**
* #153 New **send to webhook** blocks under **Other Actions**. They work exactly like the send notification blocks, but post to a Discord webhook instead, which makes them suitable for long term logging.
* Three variants: your own text, the value of an attached **Get Info** block, or your own text followed by that value.

**Improvements**

**Changes**
* The two toolbar rows in **Worlds**, **People**, **Groups**, **Avatars**, **Timeline** and **Time Spent** now sit closer together. The vertical gap between the tab row and the filter row below it is now the same as the spacing between the buttons.

**Fixed Bugs**
* #170 Fixed **Remember window size** not restoring a maximized window. VRCNext now saves the maximized state on exit and reopens maximized, and it also remembers the size and position the window had before it was maximized.
* Fixed the blank space above the header row in the **Timeline** list view. It now starts at the top of the card like every other list view.
* The **Group**, **Profile**, **Avatar** and **World** image columns in the list views are now wide enough to grab and drag when reordering columns. This includes the **Profile** column in both Timeline list views.