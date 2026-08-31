**2026.48.0**

**Improvements**
* Mutual Network and Meet Network now free their avatar and world images from memory when you leave the tab, just like every other tab. Images are reloaded from the local cache when you come back.
* New VRChat API health indicator in the taskbar: green = everything operational, yellow = minor issues or maintenance, red = major outage. Clicking it opens a mini panel with the current status, online user count, API latency and the health of each VRChat service, plus a shortcut to status.vrchat.com. Can be turned off under **Settings > Sidebar > Taskbar**.

**Meet Network**
* New tool under **Tools > Meet Network**. It shows the top 200 people you've met most often in VRChat, friends and strangers alike, arranged in rings with your most frequent meets in the center. Bigger circle = more meets.
* Click a person (or search for them) to see the worlds you met them in. The world where you ran into them the most is shown biggest.
* Right-clicking a person or a world gives you the usual context menus, so you can open profiles, join worlds and more straight from the graph.
* While a person is open, everyone else is hidden instead of rendered in the background, keeping the view clean and saving performance.

**Changes**
* The instance list in the Friends Sidebar got wider Profile, Timer and Joined columns, so the headers are no longer cut off.
* The Username column in the People tab lists (Instance, All Friends, Favorites and co.) no longer hogs all the leftover space, giving the other columns more room.
* The search in People > Instance now looks through user IDs, status texts and avatar names too, not just player names. The search bar also got a bit wider.
* The presence bar in the instance modal is now its own Presence column instead of stretching across the whole row underneath, matching the People > Instance table. It's sortable and reorderable like every other column.
* GIFs in the Media Library now use the same lightweight thumbnail cache as photos and videos instead of loading the full files into memory (a page of GIFs could easily eat 300MB before). They show a GIF badge in the corner, animate when you hover them, and play normally in the photo viewer.
* The world modal's Photos tab now shows videos taken in that world too, and uses the same clean size/resolution text as the Media Library instead of the old resolution badges. GIFs get their badge and hover preview here as well, videos a VIDEO badge with play icon.

**Fixed Bugs**
* Fixed heavy lag when zooming in close. The graph was drawing connection lines in a slow way, dropping FPS hard the further you zoomed in. It now stays smooth at any zoom level.
* Lines from people far outside your view are no longer drawn while zoomed in, and the layout simulation goes easier on large friend lists, so big networks load and settle without freezing the app.
* Fixed performance issues with Mutual Network causing lag spikes when zooming in/out fast.
* Fixed performance issues with the Mutual Network simulation while being in VR.
* Dragging a person around in Mutual Network no longer deselects them. Selection now stays until you click someone else or click an empty spot.
* Scrolling down from the Dashboard hero is much smoother. The glass fade no longer forces the whole app to recalculate its styling on every frame, and the hero background video now pauses while it's scrolled out of view.