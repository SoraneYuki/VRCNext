const HAM_ITEM_SELECTOR = [
    '.vrc-friend-card', '.vrcn-user-item', '.inst-user-row', '.iim-user-item',
    '.dash-feed-card', '.dash-flocs-card', '.dash-hw-card', '.dash-group-card',
    '.fd-group-card', '.vrcn-content-card', '.av-card',
    '.vrcn-world-card-small', '.vrcn-mini-content',
].join(', ');

const HAM_MEDIA_SELECTOR = [
    '.vrcn-content-card', '.vrcn-world-card-small', '.av-card',
    '.dash-hw-card', '.dash-flocs-card', '.vrcn-mini-content',
].join(', ');

let _hamItem = null;
let _hamBtn  = null;
let _hamFade = null;

function hamburgerEnabled() {
    const el = document.getElementById('setShowHamburger');
    return el ? el.checked : true;
}

function applyHamburgerSettings() {
    if (!hamburgerEnabled()) _hamHide();
}

function _hamHide() {
    if (_hamItem && _hamItem.isConnected) _hamItem.classList.remove('ham-host', 'ham-host-media');
    _hamBtn?.remove();
    _hamFade?.remove();
    _hamItem = null;
    _hamBtn  = null;
    _hamFade = null;
}

function _hamShowFor(item) {
    _hamHide();
    const r = item.getBoundingClientRect();
    if (r.width < 70 || r.height < 20) return;
    _hamItem = item;
    item.classList.add('ham-host');
    if (item.matches(HAM_MEDIA_SELECTOR)) item.classList.add('ham-host-media');

    _hamFade = document.createElement('span');
    _hamFade.className = 'vrcn-ham-fade';

    _hamBtn = document.createElement('button');
    _hamBtn.className = 'vrcn-ham-btn';
    _hamBtn.innerHTML = '<span class="msi">more_vert</span>';
    const swallow = e => { e.stopPropagation(); };
    _hamBtn.addEventListener('mousedown', swallow);
    _hamBtn.addEventListener('pointerdown', swallow);
    _hamBtn.addEventListener('contextmenu', swallow);
    _hamBtn.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
        _hamOpen(e);
    });

    item.appendChild(_hamFade);
    item.appendChild(_hamBtn);
}

function _hamOpen(e) {
    const item = _hamItem;
    if (!item || !item.isConnected) { _hamHide(); return; }
    item.dispatchEvent(new MouseEvent('contextmenu', {
        bubbles: true, cancelable: true,
        clientX: e.clientX, clientY: e.clientY,
    }));
}

document.addEventListener('mouseover', e => {
    if (!(e.target instanceof Element)) return;
    if (!hamburgerEnabled()) return;
    const item = e.target.closest(HAM_ITEM_SELECTOR);
    if (item) { if (item !== _hamItem) _hamShowFor(item); }
    else _hamHide();
}, { passive: true });
