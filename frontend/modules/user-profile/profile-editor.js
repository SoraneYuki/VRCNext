(function () {
    'use strict';

    const _plusCache      = {};
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

    function vrcnPlusOnProfileOpened(userId) {
        if (!userId || typeof sendToCS !== 'function') return;
        if (_pendingFetches.has(userId)) return;
        _pendingFetches.add(userId);
        sendToCS({ action: 'vrcnPlusCheckEntitlement', userId });
    }
    window.vrcnPlusOnProfileOpened = vrcnPlusOnProfileOpened;

    window.vrcnPlusEntitlement = function (payload) {
        if (!payload || !payload.userId) return;
        _pendingFetches.delete(payload.userId);
        const wasPlus = _plusCache[payload.userId];
        const isPlus  = !!payload.isPlus;
        _plusCache[payload.userId] = isPlus;
        if (wasPlus === undefined || wasPlus !== isPlus) _maybeReRenderProfile(payload.userId);
    };
})();
