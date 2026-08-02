/* === Timeline List Tables — column order + sorting === */

const TL_TABLE_DEFS = {
    personal: [
        { id: 'dt',      key: 'timeline.list.header.date_time', fallback: 'Date / Time', width: '155px', sort: 'timestamp' },
        { id: 'type',    key: 'timeline.list.header.type',      fallback: 'Type',        width: '135px', sort: 'type' },
        { id: 'profile', key: 'timeline.list.header.profile',   fallback: 'Profile',     width: '80px',  sort: 'user_name' },
        { id: 'user',    key: 'timeline.list.header.user',      fallback: 'User',        width: '130px', sort: 'user_name' },
        { id: 'detail',  key: 'timeline.list.header.detail',    fallback: 'Detail',      width: '',      sort: 'message' },
    ],
    friends: [
        { id: 'dt',      key: 'timeline.list.header.date_time', fallback: 'Date / Time', width: '155px', sort: 'timestamp' },
        { id: 'type',    key: 'timeline.list.header.type',      fallback: 'Type',        width: '135px', sort: 'type' },
        { id: 'profile', key: 'timeline.list.header.profile',   fallback: 'Profile',     width: '80px',  sort: 'friend_name' },
        { id: 'user',    key: 'timeline.list.header.user',      fallback: 'User',        width: '130px', sort: 'friend_name' },
        { id: 'detail',  key: 'timeline.list.header.detail',    fallback: 'Detail',      width: '',      sort: 'world_name' },
    ],
    gamelog: [
        { id: 'dt',    key: 'timeline.list.header.date_time', fallback: 'Date / Time', width: '155px', sort: 'timestamp' },
        { id: 'type',  key: 'timeline.list.header.type',      fallback: 'Type',        width: '120px', sort: 'label' },
        { id: 'event', key: 'gamelog.header.event',           fallback: 'Event',       width: '',      sort: 'message' },
    ],
};

const _tlTableState = {};

function _tlTableStorageKey(list) { return 'vrcn_tl_table_' + list; }

function tlTableState(list) {
    if (_tlTableState[list]) return _tlTableState[list];
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(_tlTableStorageKey(list)) || 'null'); } catch {}
    const defs  = TL_TABLE_DEFS[list] || [];
    const valid = defs.map(c => c.id);
    const order = Array.isArray(saved?.order)
        ? saved.order.filter(id => valid.includes(id)).concat(valid.filter(id => !saved.order.includes(id)))
        : valid.slice();
    _tlTableState[list] = {
        order,
        sortId:  typeof saved?.sortId === 'string' ? saved.sortId : 'dt',
        sortDir: saved?.sortDir === 'asc' ? 'asc' : 'desc',
    };
    return _tlTableState[list];
}

function _tlTableSave(list) {
    try { localStorage.setItem(_tlTableStorageKey(list), JSON.stringify(tlTableState(list))); } catch {}
}

function tlTableSortField(list) {
    const st  = tlTableState(list);
    const def = (TL_TABLE_DEFS[list] || []).find(c => c.id === st.sortId);
    return { field: def?.sort || 'timestamp', dir: st.sortDir };
}

function tlSortParams(list) {
    const { field, dir } = tlTableSortField(list);
    return { sortBy: field, sortDir: dir };
}

function tlTableColumns(list) {
    const defs = TL_TABLE_DEFS[list] || [];
    return tlTableState(list).order.map(id => defs.find(c => c.id === id)).filter(Boolean);
}

function tlTableSort(list, colId) {
    const st = tlTableState(list);
    if (st.sortId === colId) st.sortDir = st.sortDir === 'asc' ? 'desc' : 'asc';
    else { st.sortId = colId; st.sortDir = 'desc'; }
    _tlTableSave(list);
    _tlTableRerender(list);
}

function _tlTableRerender(list) {
    if (list === 'personal' && typeof reloadTimelineSorted === 'function') reloadTimelineSorted();
    else if (list === 'friends' && typeof reloadFriendTimelineSorted === 'function') reloadFriendTimelineSorted();
    else if (list === 'gamelog' && typeof renderGameLog === 'function') renderGameLog();
}

function _tlTableRedraw(list) {
    if (list === 'personal' && typeof filterTimeline === 'function') filterTimeline();
    else if (list === 'friends' && typeof filterFriendTimeline === 'function') filterFriendTimeline();
    else if (list === 'gamelog' && typeof renderGameLog === 'function') renderGameLog();
}

const _TL_DRAG_MS   = 200;
const _TL_DRAG_EASE = 'cubic-bezier(.2,.7,.3,1)';
let _tlDrag = null;

function _tlColIndex(th) {
    return Array.prototype.indexOf.call(th.parentElement.children, th);
}

function _tlPlaceColumn(table, from, to, mode) {
    if (from === to) return;
    const containers = [
        table.querySelector('colgroup'),
        table.querySelector('thead tr'),
        ...table.querySelectorAll('tbody tr'),
    ];
    containers.forEach(row => {
        if (!row || row.children.length <= Math.max(from, to)) return;
        const cell = row.children[from];
        const ref  = row.children[to];
        if (!cell || !ref) return;
        row.insertBefore(cell, mode === 'before' ? ref : ref.nextSibling);
    });
}

function _tlHeadSnap(headRow) {
    const map = new Map();
    Array.from(headRow.children).forEach(el => map.set(el, el.getBoundingClientRect().left));
    return map;
}

function _tlHeadFlip(headRow, prev) {
    Array.from(headRow.children).forEach(el => {
        if (!prev.has(el)) return;
        const dx = prev.get(el) - el.getBoundingClientRect().left;
        if (!dx) return;
        el.animate(
            [{ transform: `translateX(${dx}px)` }, { transform: 'translateX(0)' }],
            { duration: _TL_DRAG_MS, easing: _TL_DRAG_EASE }
        );
    });
}

function _tlDragDown(e) {
    const grip = e.target.closest('.tl-th-grip');
    if (!grip || e.button !== 0) return;
    const th    = grip.closest('th.tl-th');
    const table = th?.closest('.tl-list-table');
    const list  = table?.dataset.tlList;
    if (!th || !table || !list) return;

    e.preventDefault();
    e.stopPropagation();

    const rect  = th.getBoundingClientRect();
    const ghost = th.cloneNode(true);
    Object.assign(ghost.style, {
        position: 'fixed',
        top: rect.top + 'px',
        left: rect.left + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: '10020',
        opacity: '0.92',
        boxShadow: '0 14px 40px rgba(0,0,0,.55)',
        borderRadius: '8px',
        background: 'var(--bg-card)',
        transform: 'scale(1.02)',
    });
    document.body.appendChild(ghost);
    th.classList.add('tl-th-dragging');

    _tlDrag = { list, table, th, ghost, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top, lastKey: null };
    grip.setPointerCapture?.(e.pointerId);
    window.addEventListener('pointermove', _tlDragMove);
    window.addEventListener('pointerup', _tlDragUp);
    window.addEventListener('pointercancel', _tlDragUp);
    document.body.style.cursor = 'grabbing';
}

function _tlDragMove(e) {
    if (!_tlDrag) return;
    const { table, th, ghost } = _tlDrag;
    ghost.style.top  = (e.clientY - _tlDrag.offsetY) + 'px';
    ghost.style.left = (e.clientX - _tlDrag.offsetX) + 'px';

    const headRow = table.querySelector('thead tr');
    const others  = Array.from(headRow.children).filter(cell => cell !== th);

    let drop = null;
    for (const cell of others) {
        const rect = cell.getBoundingClientRect();
        if (e.clientX < rect.left + rect.width / 2) { drop = { mode: 'before', target: cell }; break; }
        drop = { mode: 'after', target: cell };
    }
    if (!drop) return;

    const key = drop.mode + ':' + drop.target.className;
    if (key === _tlDrag.lastKey) return;
    _tlDrag.lastKey = key;

    const prev = _tlHeadSnap(headRow);
    _tlPlaceColumn(table, _tlColIndex(th), _tlColIndex(drop.target), drop.mode);
    _tlHeadFlip(headRow, prev);
}

function _tlDragUp() {
    if (!_tlDrag) return;
    window.removeEventListener('pointermove', _tlDragMove);
    window.removeEventListener('pointerup', _tlDragUp);
    window.removeEventListener('pointercancel', _tlDragUp);
    document.body.style.cursor = '';

    const { list, table, th, ghost } = _tlDrag;
    _tlDrag = null;

    const finalRect = th.getBoundingClientRect();
    const ghostRect = ghost.getBoundingClientRect();
    ghost.animate(
        [
            { transform: 'translate(0,0) scale(1.02)', opacity: 0.92 },
            { transform: `translate(${finalRect.left - ghostRect.left}px,${finalRect.top - ghostRect.top}px) scale(1)`, opacity: 1 },
        ],
        { duration: _TL_DRAG_MS, easing: _TL_DRAG_EASE, fill: 'forwards' }
    ).onfinish = () => {
        ghost.remove();
        th.classList.remove('tl-th-dragging');

        const order = Array.from(table.querySelectorAll('thead th.tl-th'))
            .map(cell => (cell.className.match(/tl-th-([a-z]+)\b/) || [])[1])
            .filter(id => id && id !== 'sorted' && id !== 'dragging');
        const st = tlTableState(list);
        if (order.length === st.order.length) {
            st.order = order;
            _tlTableSave(list);
        }
        _tlTableRedraw(list);
    };
}

document.addEventListener('pointerdown', _tlDragDown, true);

function tlTableHtml(list, rowsHtml, staticHeader) {
    const cols = tlTableColumns(list);
    const st   = tlTableState(list);

    const colgroup = cols.map(c => `<col${c.width ? ` style="width:${c.width}"` : ''}>`).join('');

    if (staticHeader) {
        const plain = cols.map(c => `<th class="tl-th-${c.id}">${esc(t(c.key, c.fallback))}</th>`).join('');
        return `<div class="tl-list-wrap">
            <table class="tl-list-table">
                <colgroup>${colgroup}</colgroup>
                <thead><tr>${plain}</tr></thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>`;
    }

    const heads = cols.map(c => {
        const active = st.sortId === c.id;
        const arrow  = active ? (st.sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more';
        return `<th class="tl-th tl-th-${c.id}${active ? ' tl-th-sorted' : ''}"
            onclick="tlTableSort('${list}','${c.id}')"
            title="${esc(t('timeline.list.header.hint', 'Click to sort, drag to reorder'))}">
            <span class="tl-th-label">${esc(t(c.key, c.fallback))}</span>
            <span class="msi tl-th-arrow">${arrow}</span>
            <span class="msi tl-th-grip" title="${esc(t('timeline.list.header.reorder', 'Drag to reorder'))}">drag_indicator</span>
        </th>`;
    }).join('');

    return `<div class="tl-list-wrap">
        <table class="tl-list-table" data-tl-list="${list}">
            <colgroup>${colgroup}</colgroup>
            <thead><tr>${heads}</tr></thead>
            <tbody>${rowsHtml}</tbody>
        </table>
    </div>`;
}

function tlTableRow(list, attrs, cells) {
    const tds = tlTableColumns(list).map(c => cells[c.id] || '<td></td>').join('');
    return `<tr class="tl-list-row"${attrs}>${tds}</tr>`;
}

const TL_LOCAL_ACCESSORS = {
    personal: {
        dt:      e => e.timestamp || '',
        type:    e => (e.type || '').toLowerCase(),
        profile: e => (e.userName || '').toLowerCase(),
        user:    e => (e.userName || '').toLowerCase(),
        detail:  e => (e.message || '').toLowerCase(),
    },
    friends: {
        dt:      e => e.timestamp || '',
        type:    e => (e.type || '').toLowerCase(),
        profile: e => (e.friendName || '').toLowerCase(),
        user:    e => (e.friendName || '').toLowerCase(),
        detail:  e => (e.worldName || '').toLowerCase(),
    },
};

function tlSortEventsLocal(list, events) {
    return tlTableSortLocal(list, events, TL_LOCAL_ACCESSORS[list] || {});
}

function tlTableSortLocal(list, entries, accessors) {
    const st = tlTableState(list);
    const get = accessors[st.sortId];
    if (!get) return entries;
    const dir = st.sortDir === 'asc' ? 1 : -1;
    return entries.slice().sort((a, b) => {
        const va = get(a), vb = get(b);
        if (va === vb) return 0;
        return (va > vb ? 1 : -1) * dir;
    });
}
