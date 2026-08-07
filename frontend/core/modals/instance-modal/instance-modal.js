/* === Instance Modal === */
/* === Instance Info Modal === */

function openInstanceInfoModal() {
    const data = currentInstanceData;
    if (!data || data.empty || data.error || (!data.worldName && !data.worldId)) return;

    const m = document.getElementById('modalInstanceInfo');
    const c = document.getElementById('instanceInfoContent');
    if (!m || !c) return;

    const thumb = data.worldThumb || '';
    const name  = data.worldName || data.worldId || t('instance.unknown_world', 'Unknown World');
    const { cls: instCls, label: instLabel } = getInstanceBadge(data.instanceType);
    const instNum = (data.location || '').match(/:(\d+)/)?.[1] || '';

    const bannerHtml = thumb
        ? `<div class="fd-banner"><img src="${thumb}" onerror="this.parentElement.style.display='none'"><div class="fd-banner-fade"></div></div>`
        : '';

    // Build friend lookup maps
    const byId   = {};
    const byName = {};
    vrcFriendsData.forEach(f => {
        if (f.id)          byId[f.id] = f;
        if (f.displayName) byName[f.displayName.toLowerCase()] = f;
    });

    // User list — fall back to friends in same location
    let users = (data.users || []).slice();
    if (users.length === 0 && data.location) {
        const myLocBase = data.location.split('~')[0];
        users = vrcFriendsData.filter(f => {
            if (!f.location || f.location === 'private' || f.location === 'offline') return false;
            return f.location.split('~')[0] === myLocBase;
        });
    }

    // Enrich with live friend data
    const enriched = users.map(u => {
        const friend = (u.id && byId[u.id]) || (u.displayName && byName[(u.displayName || '').toLowerCase()]);
        return { ...u, _friend: friend || null };
    });

    _iimSortEntries(enriched);

    const now = Date.now();
    const hasTimers = enriched.some(u => u.joinedAt);
    const iStart = enriched.reduce((min, u) => (u.joinedAt && u.joinedAt < min) ? u.joinedAt : min, now);
    const iTotal = now - iStart;

    function fmtTimer(joinedAt) {
        return formatInstanceTimer(joinedAt, now);
    }

    const timerHead = hasTimers ? _iimHeadCell('timer', t('instance.table.timer', 'Timer')) : '';
    const listHead = `<div class="iim-list-head">
        ${_iimHeadCell('profile', t('instance.table.profile', 'Profile'))}
        ${timerHead}
        ${_iimHeadCell('joined', t('instance.table.joined', 'Joined'))}
        ${_iimHeadCell('name', t('instance.table.display_name', 'Display Name'))}
        ${_iimHeadCell('rank', t('instance.table.rank', 'Rank'))}
        ${_iimHeadCell('status', t('instance.table.status', 'Status'))}
        ${_iimHeadCell('age', '18+')}
        ${_iimHeadCell('platform', t('instance.table.platform', 'Platform'))}
        ${_iimHeadCell('language', t('instance.table.language', 'Language'))}
    </div>`;

    const copyBadge = instNum
        ? `<span class="vrcn-id-clip" onclick="copyInstanceLink('${jsq(data.location || '')}')"><span class="msi" style="font-size:12px;">content_copy</span>#${esc(instNum)}</span>`
        : '';
    const wid = jsq(data.worldId || '');

    // Split enriched list into friends and non-friends
    const friendsEnriched = enriched.filter(u => !!u._friend);
    const othersEnriched  = enriched.filter(u => !u._friend);

    function makeRow(u) {
        const f           = u._friend;
        const isSelf      = currentVrcUser && u.id && u.id === currentVrcUser.id;
        const src         = isSelf ? currentVrcUser : f;
        const id          = u.id || '';
        const displayName = u.displayName || '?';
        const image       = src?.image           || u.image             || '';
        const status      = src?.status          || u.status            || '';
        const statusDesc  = src?.statusDescription ?? u.statusDescription ?? '';
        const tags        = (f?.tags?.length ? f.tags : null) || u.tags || [];
        const platform    = f?.platform          || u.platform          || '';
        const ageVerified = !!(f?.ageVerified || u.ageVerified);
        const avHtml = image
            ? `<div class="iim-av" style="background-image:url('${cssUrl(image)}')"></div>`
            : `<div class="iim-av iim-av-letter">${esc(displayName[0].toUpperCase())}</div>`;
        const timerCell = hasTimers
            ? `<div class="iim-cell iim-muted-cell">${esc(fmtTimer(u.joinedAt))}</div>`
            : '';
        const trust = getTrustRank(tags);
        const rankCell = `<div class="iim-cell">${trust ? `<span class="vrcn-badge ${trust.cls}" style="font-size:calc(10px + var(--fs-off, 0px));">${esc(trust.label)}</span>` : ''}</div>`;
        const dotCls = statusDotClass(status);
        const statusCell = `<div class="iim-cell"><div class="iim-status-cell">
            ${status ? `<span class="vrc-status-dot ${dotCls}" style="width:7px;height:7px;flex-shrink:0;"></span>` : ''}
            <span style="font-size:calc(11px + var(--fs-off, 0px));">${esc(statusDesc || statusLabel(status))}</span>
        </div></div>`;
        let platIcon = '';
        if      (platform === 'standalonewindows') platIcon = `<span class="msi" title="${t('instance.platform.pc', 'PC')}" style="font-size:16px;color:var(--tx2);">computer</span>`;
        else if (platform === 'android')           platIcon = `<span class="msi" title="${t('instance.platform.quest', 'Quest')}" style="font-size:16px;color:var(--tx2);">view_in_ar</span>`;
        const platformCell = `<div class="iim-cell">${platIcon}</div>`;
        const langsHtml = tags.filter(x => x.startsWith('language_'))
            .map(x => `<span class="vrcn-badge">${esc(LANG_MAP[x] || x.replace('language_', '').toUpperCase())}</span>`).join('');
        const langCell  = `<div class="iim-cell"><div class="iim-lang-cell">${langsHtml}</div></div>`;
        const nameCell  = `<div class="iim-cell"><span class="iim-name">${esc(displayName)}</span></div>`;
        const ageCell   = `<div class="iim-cell">${ageVerified ? `<span class="vrcn-badge" style="font-size:calc(10px + var(--fs-off, 0px));color:#3ba55d;border-color:#3ba55d30;background:#3ba55d18;">18+</span>` : ''}</div>`;
        const fromCell  = `<div class="iim-cell iim-muted-cell">${u.joinedAt ? esc(fmtTime(new Date(u.joinedAt))) : '&mdash;'}</div>`;
        let barHtml = '';
        if (iTotal > 0 && u.joinedAt) {
            const pStart   = u.joinedAt;
            const pEnd     = u.leftAt || now;
            const leftPct  = Math.max(0, Math.min(100, (pStart - iStart) / iTotal * 100));
            const widthPct = Math.max(0, Math.min(100 - leftPct, (pEnd - pStart) / iTotal * 100));
            const barCls   = (u._friend || isSelf) ? ' friend' : '';
            barHtml = `<div class="iim-user-bar"><div class="tl-player-bar-wrap"><div class="tl-player-bar${barCls}" style="left:${leftPct.toFixed(1)}%;width:${widthPct.toFixed(1)}%"></div></div></div>`;
        }
        const itemClick    = id ? ` onclick="openFriendDetail('${jsq(id)}')"` : '';
        const clickableCls = id ? ' clickable' : '';
        return `<div class="iim-user-item${clickableCls}"${itemClick}>
            <div class="iim-user-row">
                <div class="iim-cell iim-profile-cell">${avHtml}</div>
                ${timerCell}
                ${fromCell}
                ${nameCell}
                ${rankCell}
                ${statusCell}
                ${ageCell}
                ${platformCell}
                ${langCell}
            </div>
            ${barHtml}
        </div>`;
    }

    let bodyRows = '';
    if (friendsEnriched.length > 0)
        bodyRows += `<div class="iim-section-label"><div class="fd-group-rep-label" style="margin:0;">${tf('instance.sections.friends_in_instance', { count: friendsEnriched.length }, 'FRIENDS IN INSTANCE ({count})')}</div></div>` + friendsEnriched.map(makeRow).join('');
    if (othersEnriched.length > 0)
        bodyRows += `<div class="iim-section-label"><div class="fd-group-rep-label" style="margin:0;">${tf('instance.sections.players_in_instance', { count: othersEnriched.length }, 'PLAYERS IN INSTANCE ({count})')}</div></div>` + othersEnriched.map(makeRow).join('');

    const wc = (typeof dashWorldCache !== 'undefined' && data.worldId) ? (dashWorldCache[data.worldId] || null) : null;
    if (data.worldId && (!wc || (!wc.description && !wc._descFetched)) && typeof sendToCS === 'function') sendToCS({ action: 'vrcGetWorldInstancesDetail', worldId: data.worldId, locations: data.location ? [data.location] : [] });
    const worldAuthor   = wc?.authorName || '';
    const worldAuthorId = wc?.authorId || '';
    const worldDesc     = wc?.description || '';

    const bannerImg = thumb
        ? `<img class="mi-world-banner" src="${thumb}" onerror="this.style.display='none'">`
        : '';

    const authorHtml = worldAuthor
        ? `<div class="mi-world-author">${t('worlds.meta.by', 'by')} ${worldAuthorId
            ? `<span onclick="closeInstanceInfoModal();navOpenModal('friend','${jsq(worldAuthorId)}','${jsq(worldAuthor)}')" style="display:inline-flex;align-items:center;padding:1px 8px;border-radius:20px;background:var(--bg-hover);font-size:calc(11px + var(--fs-off, 0px));font-weight:600;color:var(--tx1);cursor:pointer;line-height:1.8;">${esc(worldAuthor)}</span>`
            : esc(worldAuthor)}</div>`
        : '';
    const descHtml = worldDesc ? `<div class="mi-world-description">${esc(worldDesc)}</div>` : '';

    const leftHtml = `<div class="mi-left">
        <div class="mi-world-banner-wrap">${bannerImg}<div class="mi-world-banner-fade"></div></div>
        <div class="mi-world-info">
            <div class="mi-world-name">${esc(name)}</div>
            ${authorHtml}
            ${descHtml}
        </div>
        <div class="mi-left-actions">
            <button class="vrcn-button-round mi-action-btn" onclick="closeInstanceInfoModal();openInviteModal()"><span class="msi" style="font-size:14px;">person_add</span> ${t('instance.actions.invite', 'Invite')}</button>
            <button class="vrcn-button-round mi-action-btn" onclick="closeInstanceInfoModal();openWorldSearchDetail('${wid}')">${t('dashboard.instances.open_world', 'Open World')}</button>
        </div>
    </div>`;

    const joinBtn = data.location
        ? `<button class="vrcn-button-round vrcn-btn-join" style="margin-left:auto;" title="${esc(t('common.join', 'Join'))}" onclick="sendToCS({action:'vrcJoinFriend',location:'${jsq(data.location)}'})"><span class="msi" style="font-size:14px;">login</span> ${esc(t('common.join', 'Join'))}</button>`
        : '';
    const cardHeader = `<div class="mi-instance-header">
        <span class="vrcn-badge ${instCls}">${instLabel}</span>
        ${copyBadge}
        ${data.ageGate ? `<span class="vrcn-badge" style="background:rgba(255,75,85,.15);color:var(--err);">${esc(t('worlds.instances.age_gated', 'Age Gated'))}</span>` : ''}
        ${getOwnerBadgeHtml(data.ownerId || '', data.ownerName || '', data.ownerGroup || '', 'closeInstanceInfoModal()')}
        <span class="vrcn-badge"><span class="msi" style="font-size:11px;">person</span>&nbsp;${users.length || data.nUsers || 0}${data.capacity ? '/' + data.capacity : ''}</span>
        ${joinBtn}
    </div>`;

    const playersHtml = enriched.length > 0
        ? `<div class="iim-list${hasTimers ? ' has-timers' : ''}">${listHead}<div class="iim-list-body">${bodyRows}</div></div>`
        : `<div style="padding:14px;color:var(--tx3);font-size:calc(12px + var(--fs-off, 0px));">${t('instance.no_player_data_available', 'No player data available.')}</div>`;

    const rightHtml = `<div class="mi-right"><div class="mi-right-scroll" style="overflow:auto;"><div class="mi-instance-list"><div class="mi-instance-card">${cardHeader}${playersHtml}</div></div></div></div>`;

    const prevScroller  = c.querySelector('.mi-right-scroll');
    const prevScrollTop = prevScroller?.scrollTop || 0;

    const leftHidden = _iimLeftHidden();
    c.classList.toggle('iim-no-left', leftHidden);
    const panelAction = {
        icon: leftHidden ? 'left_panel_open' : 'left_panel_close',
        title: leftHidden
            ? t('instance.actions.show_world_panel', 'Show world panel')
            : t('instance.actions.hide_world_panel', 'Hide world panel'),
        onclick: 'iimToggleLeftPanel()',
    };
    c.innerHTML = `${renderModalBar(name, [panelAction, modalCloseAction('closeInstanceInfoModal()')])}<div class="mi-layout">${leftHtml}${rightHtml}</div>`;

    m.style.display = 'flex';
    if (prevScrollTop > 0) {
        const newScroll = c.querySelector('.mi-right-scroll');
        if (newScroll) newScroll.scrollTop = prevScrollTop;
    }
}

const IIM_SORT_KEY = 'vrcn_iim_sort';
const IIM_LEFT_KEY = 'vrcn_iim_hide_left';

function _iimLeftHidden() {
    try { return localStorage.getItem(IIM_LEFT_KEY) === '1'; } catch { return false; }
}

function iimToggleLeftPanel() {
    try { localStorage.setItem(IIM_LEFT_KEY, _iimLeftHidden() ? '0' : '1'); } catch {}
    openInstanceInfoModal();
}

const IIM_STATUS_ORDER = ['join me', 'active', 'ask me', 'busy', 'offline'];
let _iimSort = null;

function _iimSortState() {
    if (_iimSort) return _iimSort;
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(IIM_SORT_KEY) || 'null'); } catch {}
    _iimSort = {
        id:  typeof saved?.id === 'string' ? saved.id : 'joined',
        dir: saved?.dir === 'desc' ? 'desc' : 'asc',
    };
    return _iimSort;
}

function _iimTrustOrder(tags) {
    const rank = (typeof getTrustRank === 'function') ? getTrustRank(tags || []) : null;
    const order = ['rank-visitor', 'rank-new', 'rank-user', 'rank-known', 'rank-trusted'];
    const idx = rank ? order.indexOf(rank.cls) : -1;
    return idx < 0 ? -1 : idx;
}

function _iimSortValue(u, id) {
    const live = u._friend;
    switch (id) {
        case 'timer':
        case 'joined':   return u.joinedAt || 0;
        case 'profile':
        case 'name':     return (u.displayName || '').toLowerCase();
        case 'rank':     return _iimTrustOrder((live?.tags?.length ? live.tags : null) || u.tags || []);
        case 'status': {
            const s = (live?.status || u.status || '').toLowerCase();
            const idx = IIM_STATUS_ORDER.indexOf(s);
            return idx < 0 ? IIM_STATUS_ORDER.length : idx;
        }
        case 'age':      return (live?.ageVerified || u.ageVerified) ? 1 : 0;
        case 'platform': return (live?.platform || u.platform || '').toLowerCase();
        case 'language': {
            const tags = (live?.tags?.length ? live.tags : null) || u.tags || [];
            const lang = tags.find(x => x.startsWith('language_')) || '';
            return lang.replace('language_', '');
        }
        default:         return 0;
    }
}

function _iimSortEntries(entries) {
    const st  = _iimSortState();
    const dir = st.dir === 'asc' ? 1 : -1;
    entries.sort((a, b) => {
        const va = _iimSortValue(a, st.id);
        const vb = _iimSortValue(b, st.id);
        if (va === vb) return (a.joinedAt || 0) - (b.joinedAt || 0);
        return (va > vb ? 1 : -1) * dir;
    });
}

function _iimHeadCell(id, label, extraCls) {
    const st     = _iimSortState();
    const active = st.id === id;
    const arrow  = active ? (st.dir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more';
    return `<div class="iim-head-cell iim-head-sortable${active ? ' iim-head-sorted' : ''}${extraCls ? ' ' + extraCls : ''}"
        onclick="iimSort('${id}')" title="${esc(t('timeline.list.header.sort_hint', 'Click to sort'))}">
        <span>${esc(label)}</span><span class="msi iim-head-arrow">${arrow}</span>
    </div>`;
}

function iimSort(id) {
    const st = _iimSortState();
    if (st.id === id) st.dir = st.dir === 'asc' ? 'desc' : 'asc';
    else { st.id = id; st.dir = 'asc'; }
    try { localStorage.setItem(IIM_SORT_KEY, JSON.stringify(st)); } catch {}
    openInstanceInfoModal();
}

function closeInstanceInfoModal() {
    document.getElementById('modalInstanceInfo').style.display = 'none';
}

//Avatar Lookup avtrdb context logic
function handleInstanceAvatarFound(payload) {
    const { userId, avatarId } = payload;
    if (!userId) return;
    if (avatarId) openAvatarDetail(avatarId);
    else showToast(false, t('context_menu.avatar_not_found', 'No public avatar found'));
}

function ctxCheckAvatar(userId) {
    sendToCS({ action: 'vrcGetInstanceAvatars', userIds: [userId] });
}

let _instanceInfoTimer = null;
function requestInstanceInfo() {
    if (!currentVrcUser) return;
    clearTimeout(_instanceInfoTimer);
    _instanceInfoTimer = setTimeout(() => sendToCS({ action: 'vrcGetCurrentInstance' }), 500);
}
