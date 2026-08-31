**2026.48.0**

**Improvements**
* Mutual Network and Meet Network now free their avatar and world images from memory when you leave the tab, just like every other tab. Images are reloaded from the local cache when you come back.

**Meet Network**
* New tool under **Tools > Meet Network**. It shows the top 200 people you've met most often in VRChat, friends and strangers alike, arranged in rings with your most frequent meets in the center. Bigger circle = more meets.
* Click a person (or search for them) to see the worlds you met them in. The world where you ran into them the most is shown biggest.
* Right-clicking a person or a world gives you the usual context menus, so you can open profiles, join worlds and more straight from the graph.
* While a person is open, everyone else is hidden instead of rendered in the background, keeping the view clean and saving performance.

**Changes**

**Fixed Bugs**
* Fixed heavy lag when zooming in close. The graph was drawing connection lines in a slow way, dropping FPS hard the further you zoomed in. It now stays smooth at any zoom level.
* Lines from people far outside your view are no longer drawn while zoomed in, and the layout simulation goes easier on large friend lists, so big networks load and settle without freezing the app.
* Fixed performance issues with Mutual Network causing lag spikes when zooming in/out fast.
* Fixed performance issues with the Mutual Network simulation while being in VR.
* Dragging a person around in Mutual Network no longer deselects them. Selection now stays until you click someone else or click an empty spot.