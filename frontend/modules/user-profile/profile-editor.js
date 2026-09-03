(function () {
    'use strict';

    const COLOR_DEFS = [
        { key: 'bg-base',   defaultVal: '#0E0E15' },
        { key: 'bg-card',   defaultVal: '#22222D' },
        { key: 'bg-hover',  defaultVal: '#2A2A38' },
        { key: 'bg-input',  defaultVal: '#1A1A24' },
        { key: 'accent',    defaultVal: '#FF66CC' },
        { key: 'accent-lt', defaultVal: '#FFA0DD' },
        { key: 'tx0',       defaultVal: '#FFFFFF' },
        { key: 'tx1',       defaultVal: '#F0F0F5' },
        { key: 'tx2',       defaultVal: '#B0B0BD' },
        { key: 'tx3',       defaultVal: '#7A7A88' },
        { key: 'brd',       defaultVal: '#33333F' },
        { key: 'brd-lt',    defaultVal: '#4A4A58' },
    ];
    const ALL_KEY_SET = new Set(COLOR_DEFS.map(d => d.key));

    const _themeCache    = {};
    const _plusCache     = {};
    const _pendingFetches = new Set();

    window.vrcnPlusIsKnownPlus = function (userId) { return !!_plusCache[userId]; };

    window.vrcnPlusBadgeHtml = function (extraWrapperClass) {
        const cls   = 'fd-vrc-badge-wrap vrcn-plus-badge' + (extraWrapperClass ? ' ' + extraWrapperClass : '');
        const name  = encodeURIComponent('VRCN+ Subscriber');
        const desc  = encodeURIComponent('Awarded for subscribing to VRCN+');
        const img   = 'assets/Badges/VRCNPlus.png';
        return `<div class="${cls}" data-badge-img="${img}" data-badge-name="${name}" data-badge-desc="${desc}">`
             + `<img class="fd-vrc-badge-icon" src="${img}" alt="VRCN+ Subscriber" onerror="this.closest('.fd-vrc-badge-wrap').style.display='none'">`
             + `</div>`;
    };

    function _maybeReRenderProfile(userId) {
        const myp = document.getElementById('modalMyProfile');
        if (typeof currentVrcUser !== 'undefined' && currentVrcUser && currentVrcUser.id === userId
            && myp && myp.style.display !== 'none' && typeof renderMyProfileContent === 'function') {
            try { renderMyProfileContent(); } catch (e) { console.error('[VRCN+] re-render my-profile', e); }
        }
        const fd = document.getElementById('modalFriendDetail');
        if (typeof currentFriendDetail !== 'undefined' && currentFriendDetail && currentFriendDetail.id === userId
            && fd && fd.style.display !== 'none' && typeof renderFriendDetail === 'function') {
            try { renderFriendDetail(currentFriendDetail); } catch (e) { console.error('[VRCN+] re-render friend', e); }
        }
    }

    function _isHex(s) { return typeof s === 'string' && /^#[0-9a-fA-F]{6}$/.test(s); }

    function _normalizeColors(input) {
        const out = {};
        if (!input || typeof input !== 'object') return out;
        for (const k of Object.keys(input)) {
            if (ALL_KEY_SET.has(k) && _isHex(input[k])) out[k] = input[k].toUpperCase();
        }
        return out;
    }

    function vrcnPlusApplyThemeToElement(el, colors) {
        if (!el) return;
        const clean = _normalizeColors(colors);
        for (const def of COLOR_DEFS) el.style.removeProperty('--' + def.key);
        if (Object.keys(clean).length === 0) {
            el.classList.remove('vrcnp-themed');
            return;
        }
        for (const k of Object.keys(clean)) el.style.setProperty('--' + k, clean[k]);
        el.classList.add('vrcnp-themed');
    }
    window.vrcnPlusApplyThemeToElement = vrcnPlusApplyThemeToElement;

    function _applyToProfileTargets(userId) {
        const colors = _themeCache[userId];
        if (typeof currentVrcUser !== 'undefined' && currentVrcUser && currentVrcUser.id === userId) {
            const box = document.querySelector('#modalMyProfile .modal-box');
            if (box) vrcnPlusApplyThemeToElement(box, colors);
        }
        if (typeof currentFriendDetail !== 'undefined' && currentFriendDetail && currentFriendDetail.id === userId) {
            const fd = document.querySelector('#modalFriendDetail .modal-box');
            if (fd) vrcnPlusApplyThemeToElement(fd, colors);
        }
        const fp = document.getElementById('fpPreview');
        if (fp && fp.dataset.uid === userId && fp.classList.contains('visible')) {
            vrcnPlusApplyThemeToElement(fp, colors);
        }
    }

    function vrcnPlusRequestTheme(userId) {
        if (!userId || typeof sendToCS !== 'function') return;
        if (_themeCache[userId] !== undefined) {
            _applyToProfileTargets(userId);
            if (_pendingFetches.has(userId)) return;
        }
        _pendingFetches.add(userId);
        sendToCS({ action: 'vrcnPlusGetTheme', userId });
    }
    window.vrcnPlusRequestTheme = vrcnPlusRequestTheme;

    function vrcnPlusOnProfileOpened(userId, targetEl) {
        if (!userId) return;
        document.querySelectorAll('#modalMyProfile .modal-box, #modalFriendDetail .modal-box').forEach(el => {
            if (el !== targetEl) vrcnPlusApplyThemeToElement(el, null);
        });
        if (targetEl) vrcnPlusApplyThemeToElement(targetEl, _themeCache[userId] || null);
        vrcnPlusRequestTheme(userId);
    }
    window.vrcnPlusOnProfileOpened = vrcnPlusOnProfileOpened;

    window.vrcnPlusTheme = function (payload) {
        if (!payload || !payload.userId) return;
        _pendingFetches.delete(payload.userId);
        const colors = (payload.theme && payload.theme.colors && typeof payload.theme.colors === 'object')
            ? _normalizeColors(payload.theme.colors)
            : null;
        _themeCache[payload.userId] = colors;
        _applyToProfileTargets(payload.userId);
    };

    window.vrcnPlusEntitlement = function (payload) {
        if (!payload || !payload.userId) return;
        const wasPlus = _plusCache[payload.userId];
        const isPlus  = !!payload.isPlus;
        _plusCache[payload.userId] = isPlus;
        if (wasPlus === undefined || wasPlus !== isPlus) _maybeReRenderProfile(payload.userId);
    };
})();
