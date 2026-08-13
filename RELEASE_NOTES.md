**2026.41.12**

**Improvements**

* Fixed false **Went Offline** and **Came Online** entries when friends were only switching between instances. VRChat may briefly report friends as offline during a world switch.
* Offline reports for in-game friends are now delayed by 1 minute. If the friend comes back online within that time, nothing is logged. The Timeline entry and VR Overlay notification are only created if they remain offline.
* While a friend is in this waiting state, the Sidebar and People tab now show **Pending offline...** with a grey status dot.
* Friends switching worlds now show **Traveling...** in the Sidebar and People tab until they arrive in the new instance.
* Timeline world visits now end at the time the friend actually left instead of 1 minute later.
