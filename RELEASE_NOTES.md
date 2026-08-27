**2026.46.8**

**Improvements**
* Resolving a world now also stores its full details in the local database, so description, tags, capacity, visits, favorites and occupants are already there the first time you open that world.

**Fixed Bugs**
* Fixed **Media Library > All Worlds** showing raw world IDs without a picture for most entries. Only the first 30 worlds were ever looked up and the rest were dropped. All worlds are now resolved in batches, and the filter list fills in as the names arrive.