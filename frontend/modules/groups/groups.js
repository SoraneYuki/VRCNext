/* === Join State === */
function getJoinStateLabel(js) {
    const map = {
        open: ['groups.join_state.open', 'Open'],
        closed: ['groups.join_state.closed', 'Closed'],
        invite: ['groups.join_state.invite_only', 'Invite Only'],
        request: ['groups.join_state.request_invite', 'Request Invite'],
    };
    const entry = map[js];
    return entry ? t(entry[0], entry[1]) : (js || '?');
}

function getGroupMembersText(count) {
    return tf('worlds.groups.members', { count }, '{count} members');
}

function joinStateBadge(js) {
    const map = {
        open:    { label: getJoinStateLabel('open'), cls: 'public'  },
        closed:  { label: getJoinStateLabel('closed'), cls: 'private' },
        invite:  { label: getJoinStateLabel('invite'), cls: 'friends' },
        request: { label: getJoinStateLabel('request'), cls: 'group'   },
    };
    const m = map[js] || { label: getJoinStateLabel(js), cls: 'hidden' };
    return `<span class="vrcn-badge ${m.cls}">${esc(m.label)}</span>`;
}

/* === My Groups === */

function _renderGroupListCard(g) {
    const metaParts = [];
    if (g.shortCode) metaParts.push(esc(g.shortCode));
    metaParts.push(`<span class="msi" style="font-size:12px;">group</span> ${esc(getGroupMembersText(g.memberCount || 0))}`);
    const iconHtml = g.iconUrl ? `<div class="cc-group-icon" style="background-image:url('${cssUrl(g.iconUrl)}')"></div>` : '';
    return `<div class="vrcn-content-card" onclick="openGroupDetail('${esc(g.id)}')">
        <div class="cc-bg"><img src="${g.bannerUrl||'fallback_cover.png'}" loading="lazy" decoding="async" onerror="this.src='fallback_cover.png'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"></div>
        <div class="cc-scrim"></div>
        <div class="cc-content">
            <div class="cc-name">${esc(g.name)}</div>
            <div class="cc-bottom-row">
                <div class="cc-meta">${iconHtml}${metaParts.join(' · ')}</div>
            </div>
        </div>
    </div>`;
}

let _groupTab = 'joined';

const _GROUP_TAB_BTNS = { joined: 'groupFilterJoined', mine: 'groupFilterMine', mod: 'groupFilterMod', search: 'groupFilterSearch' };

function setGroupFilter(filter) {
    if (!_GROUP_TAB_BTNS[filter]) filter = 'joined';
    for (const [key, id] of Object.entries(_GROUP_TAB_BTNS)) {
        document.getElementById(id)?.classList.toggle('active', key === filter);
    }
    const isSearch = filter === 'search';
    document.getElementById('groupMineArea').style.display   = isSearch ? 'none' : '';
    document.getElementById('groupSearchArea').style.display = isSearch ? '' : 'none';
    if (isSearch) { document.getElementById('searchGroupsInput')?.focus(); return; }
    _groupTab = filter;
    if (!myGroupsLoaded) loadMyGroups();
    else filterMyGroups();
}

function _groupIsOwn(g) {
    const meId = (typeof currentVrcUser !== 'undefined' && currentVrcUser) ? currentVrcUser.id : '';
    return !!(meId && g.ownerId === meId);
}

function _groupCanModerate(g) {
    return !!(g.canKick || g.canBan || g.canEdit || g.canManageRoles || g.canAssignRoles
           || g.canViewAudit || g.canModInstance || g.canManageMembers || g.canPost || g.canEvent);
}

function _groupTabList() {
    if (_groupTab === 'mine') return myGroups.filter(_groupIsOwn);
    if (_groupTab === 'mod')  return myGroups.filter(g => !_groupIsOwn(g) && _groupCanModerate(g));
    return myGroups;
}

function _groupEmptyMsg() {
    if (_groupTab === 'mine') return t('groups.mine.empty_owned', 'You have not created any groups');
    if (_groupTab === 'mod')  return t('groups.mine.empty_moderate', 'No groups where you have moderation rights');
    return t('groups.mine.empty_joined', 'No groups joined');
}

document.documentElement.addEventListener('languagechange', () => {
    if (typeof myGroupsLoaded !== 'undefined' && myGroupsLoaded && typeof myGroups !== 'undefined' && Array.isArray(myGroups)) {
        filterMyGroups();
    }
    if (document.getElementById('gdTabInfo') && window._currentGroupDetailFull) {
        renderGroupDetail(window._currentGroupDetailFull);
    }
});

let _myGroupsDirty = false;
function filterMyGroups() {
    const tab = document.getElementById('tab2');
    if (tab && !tab.classList.contains('active')) { _myGroupsDirty = true; return; }
    _myGroupsDirty = false;
    const q = (document.getElementById('filterGroupsInput')?.value || '').toLowerCase();
    const el = document.getElementById('myGroupsGrid');
    if (!el) return;
    const base = _groupTabList();
    const filtered = q
        ? base.filter(g => (g.name||'').toLowerCase().includes(q) || (g.shortCode||'').toLowerCase().includes(q))
        : base;
    el.innerHTML = filtered.length
        ? filtered.map(_renderGroupListCard).join('')
        : `<div class="empty-msg">${esc(q ? t('groups.mine.empty_match', 'No groups match') : _groupEmptyMsg())}</div>`;
}

function loadMyGroups() {
    sendToCS({ action: 'vrcGetMyGroups' });
}

function refreshGroups() {
    const btn = document.getElementById('groupsRefreshBtn');
    if (btn) { btn.disabled = true; btn.querySelector('.msi').textContent = 'hourglass_empty'; }
    sendToCS({ action: 'vrcGetMyGroups', force: true });
}

function renderMyGroups(list) {
    const btn = document.getElementById('groupsRefreshBtn');
    if (btn) { btn.disabled = false; btn.querySelector('.msi').textContent = 'refresh'; }
    myGroups = list || [];
    myGroupsLoaded = true;
    filterMyGroups();
    if (typeof renderDashGroupActivity === 'function') renderDashGroupActivity();
}

