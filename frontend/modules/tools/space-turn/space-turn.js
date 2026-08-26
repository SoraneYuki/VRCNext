/* Space Turn */

let _stLastState = null;

let _stKeybindMode = 'turn';
const ST_MODE_SELECTS = {
    turn:  { left: 'stLeftTurn',  right: 'stRightTurn'  },
    reset: { left: 'stLeftReset', right: 'stRightReset' },
};

const ST_BTN_IDS = ['stLeftTurn', 'stRightTurn', 'stLeftReset', 'stRightReset'];
const ST_BTN_DEFAULTS = { stLeftTurn: 2, stRightTurn: 0, stLeftReset: 0, stRightReset: 0 };

let _stOtherBtns   = {};
let _stPendingBtns = null;

function stReadBtns() {
    const o = {};
    ST_BTN_IDS.forEach(id => {
        o[id] = parseInt(document.getElementById(id)?.value ?? String(ST_BTN_DEFAULTS[id]), 10) || 0;
    });
    return o;
}

function stWriteBtns(vals) {
    ST_BTN_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const v = String(vals?.[id] ?? 0);
        el.value = el.querySelector(`option[value="${v}"]`) ? v : '0';
        if (el._vnRefresh) el._vnRefresh();
    });
}

function stSwapButtonSets() {
    const cur = stReadBtns();
    _stPendingBtns = _stOtherBtns;
    _stOtherBtns   = cur;
}

function stApplyInputMode() {
    if (_stPendingBtns) { stWriteBtns(_stPendingBtns); _stPendingBtns = null; }
    stRenderKeybind();
    stSendConfig();
}

function stSetMode(mode) {
    if (!ST_MODE_SELECTS[mode]) return;
    _stKeybindMode = mode;
    stRenderKeybind();
}

function stRenderKeybind() {
    const pills = { turn: 'stModeTurn', reset: 'stModeReset' };
    for (const [m, id] of Object.entries(pills)) {
        document.getElementById(id)?.classList.toggle('active', m === _stKeybindMode);
    }

    const map = ST_MODE_SELECTS[_stKeybindMode];
    const leftVal  = parseInt(document.getElementById(map.left)?.value  ?? '0', 10);
    const rightVal = parseInt(document.getElementById(map.right)?.value ?? '0', 10);

    document.querySelectorAll('#stControllerVisual .vro-btn').forEach(el => {
        const want = el.dataset.side === 'left' ? leftVal : rightVal;
        vriMarkBtn(el, want !== 0 ? [want] : [], 'data-st-btn-id', true);
    });
}

function stKeybindClick(el) {
    const side = el.dataset.side;
    const map  = ST_MODE_SELECTS[_stKeybindMode];
    const sel  = document.getElementById(side === 'left' ? map.left : map.right);
    if (!sel) return;

    vriZoneClick(el, 'data-st-btn-id', [parseInt(sel.value, 10) || 0], id => {
        const cur = parseInt(sel.value, 10);
        sel.value = cur === id ? '0' : String(id);
        if (sel._vnRefresh) sel._vnRefresh();
        stRenderKeybind();
        stAutoSave();
    });
}

let _stLegacyView = false;
function stToggleView(btn) {
    _stLegacyView = !_stLegacyView;
    const vis  = document.getElementById('stControllerVisual');
    const pill = document.getElementById('stKeybindPills');
    const leg  = document.getElementById('stLegacyView');
    if (vis)  vis.style.display  = _stLegacyView ? 'none' : '';
    if (pill) pill.style.display = _stLegacyView ? 'none' : '';
    if (leg)  leg.style.display  = _stLegacyView ? '' : 'none';
    btn?.classList.toggle('active', _stLegacyView);
}

function stConnectBtnHtml() {
    return `<span class="msi" style="font-size:16px;">link</span> ${esc(t('common.connect', 'Connect'))}`;
}

function stDisconnectBtnHtml() {
    return `<span class="msi" style="font-size:16px;">link_off</span> ${esc(t('common.disconnect', 'Disconnect'))}`;
}

function stStatusText(state) {
    if (!state?.connected) return state?.error || t('steamvr.status.not_connected', 'Not connected');
    return state.turning
        ? t('spaceturn.status.turning', 'Turning...')
        : t('steamvr.status.connected', 'Connected to Space');
}

function stConnect() {
    if (stConnected) {
        sendToCS({ action: 'stDisconnect' });
    } else {
        sendToCS({ action: 'stConnect' });
        stSendConfig();
    }
}

function stReset() {
    sendToCS({ action: 'stReset' });
}

function stSendConfig() {
    sendToCS({
        action: 'stConfig',
        turnMultiplier: parseFloat(document.getElementById('stMultiplier')?.value) || 1,
        snapDegrees:    parseFloat(document.getElementById('stSnapDegrees')?.value) || 0,
        invert:         !!document.getElementById('stInvert')?.checked,
        smoothing:      parseFloat(document.getElementById('stSmoothing')?.value) || 0,
        leftTurnBtn:    parseInt(document.getElementById('stLeftTurn')?.value   ?? '2', 10),
        rightTurnBtn:   parseInt(document.getElementById('stRightTurn')?.value  ?? '0', 10),
        leftResetBtn:   parseInt(document.getElementById('stLeftReset')?.value  ?? '0', 10),
        rightResetBtn:  parseInt(document.getElementById('stRightReset')?.value ?? '0', 10),
    });
}

let _stAutoTimer = null;
function stAutoSave() {
    stSendConfig();
    clearTimeout(_stAutoTimer);
    _stAutoTimer = setTimeout(() => saveSettings(), 600);
}

function handleStUpdate(data) {
    _stLastState = { ...data };
    stConnected = data.connected;

    const dot = document.getElementById('stDot');
    const txt = document.getElementById('stStatusText');
    const btn = document.getElementById('stConnBtn');
    const badge = document.getElementById('badgeSpaceTurn');
    if (!dot || !txt || !btn) return;

    if (data.connected) {
        dot.classList.remove('offline');
        dot.classList.add('online');
        txt.textContent = stStatusText(data);
        txt.style.color = data.turning ? 'var(--warn)' : 'var(--ok)';
        btn.innerHTML = stDisconnectBtnHtml();
        if (badge) badge.classList.add('tb-active');
    } else {
        dot.classList.remove('online');
        dot.classList.add('offline');
        txt.textContent = stStatusText(data);
        txt.style.color = data.error ? 'var(--err)' : 'var(--tx3)';
        btn.innerHTML = stConnectBtnHtml();
        if (badge) badge.classList.remove('tb-active');
    }

    const rot = document.getElementById('stRotation');
    if (rot) rot.textContent = (data.rotation ?? 0).toFixed(1) + '°';

    const lc = document.getElementById('stCtrlL');
    const rc = document.getElementById('stCtrlR');
    if (lc) lc.classList.toggle('detected', !!data.leftController);
    if (rc) rc.classList.toggle('detected', !!data.rightController);
}

function rerenderSpaceTurnTranslations() {
    if (_stLastState) handleStUpdate(_stLastState);
}

document.documentElement.addEventListener('languagechange', rerenderSpaceTurnTranslations);
