let currentLanguage = 'en';
let i18nBundle = {};

// The language list is no longer hardcoded in the frontend and is populated at startup by scanning JSON files on the backend
let UI_LANGUAGES = {};

// Match language codes case-insensitively and return the canonical form used in the JSON filename; fall back to English if no match is found
function normalizeUiLanguage(language) {
    const normalized = String(language || '').trim().toLowerCase();
    return Object.keys(UI_LANGUAGES).find(key => key.toLowerCase() === normalized) || 'en';
}

// Convert backend-scanned language metadata into frontend objects and generate the language buttons
function handleAvailableLanguages(languages) {
    if (!Array.isArray(languages) || languages.length === 0) return;
    UI_LANGUAGES = Object.fromEntries(languages.map(language => [language.code, {
        label: language.name || language.code,
        locale: language.locale || language.code,
        flag: language.flag || '🌐',
        order: language.order ?? 999,
    }]));
    currentLanguage = normalizeUiLanguage(currentLanguage);
    renderLanguageChips();
}

function t(key, fallback = '') {
    return i18nBundle[key] ?? fallback;
}

function tf(key, vars = {}, fallback = '') {
    return String(t(key, fallback)).replace(/\{(\w+)\}/g, (_, name) => {
        return vars[name] ?? `{${name}}`;
    });
}

function getLanguageMeta(language) {
    return UI_LANGUAGES[normalizeUiLanguage(language)];
}

function getLanguageLocale(language = currentLanguage) {
    return getLanguageMeta(language)?.locale || 'en-US';
}

function requestTranslation(language = currentLanguage) {
    sendToCS({ action: 'loadTranslation', language: normalizeUiLanguage(language) });
}

function handleTranslationData(payload) {
    currentLanguage = normalizeUiLanguage(payload?.language || currentLanguage);
    i18nBundle = payload?.translations || {};
    document.documentElement.lang = currentLanguage;
    applyTranslations();
}

let _i18nApplying = false;

function applyTranslations(root = document) {
    applyTranslationAttributes(root);
    if (root !== document || _i18nApplying) return;
    _i18nApplying = true;
    try { applyTranslationRerenders(); }
    finally { _i18nApplying = false; }
    document.documentElement.dispatchEvent(new CustomEvent('languagechange', { detail: { language: currentLanguage } }));
}

function applyTranslationAttributes(root) {
    root.querySelectorAll('[data-i18n]').forEach(el => {
        const value = t(el.dataset.i18n);
        if (value) el.textContent = value;
    });
    root.querySelectorAll('[data-i18n-html]').forEach(el => {
        const value = t(el.dataset.i18nHtml);
        if (value) el.innerHTML = value;
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const value = t(el.dataset.i18nPlaceholder);
        if (value) el.setAttribute('placeholder', value);
    });
    root.querySelectorAll('[data-i18n-title]').forEach(el => {
        const value = t(el.dataset.i18nTitle);
        if (value) el.setAttribute('title', value);
    });
}

function applyTranslationRerenders() {
    renderLanguageChips();
    if (typeof renderThemeChips === 'function') renderThemeChips();
    if (typeof renderSpecialThemeChips === 'function') renderSpecialThemeChips();
    if (typeof renderCursorThemeChips === 'function') renderCursorThemeChips();
    if (typeof renderFontGrid === 'function') renderFontGrid();
    document.querySelectorAll('select').forEach(el => el._vnRefresh && el._vnRefresh());
    if (typeof renderFolders === 'function' && settings?.folders) renderFolders(settings.folders);
    if (typeof renderExtraExeDesktop === 'function' && settings?.extraExeDesktop) renderExtraExeDesktop(settings.extraExeDesktop);
    if (typeof renderExtraExeVR === 'function' && settings?.extraExeVR) renderExtraExeVR(settings.extraExeVR);
    if (typeof renderWebhookCards === 'function') renderWebhookCards(settings?.webhooks || settings?.Webhooks || []);
    if (typeof updateCurrentPageTitle === 'function') updateCurrentPageTitle();
    if (typeof updateClock === 'function') updateClock();
    if (typeof updateFavWorldGroupHeader === 'function') updateFavWorldGroupHeader();
    if (typeof renderFavWorlds === 'function'
        && typeof _favWorldsLoaded !== 'undefined'
        && _favWorldsLoaded
        && typeof favWorldsData !== 'undefined'
        && typeof favWorldGroups !== 'undefined') {
        renderFavWorlds({ worlds: favWorldsData, groups: favWorldGroups });
    }
    if (typeof renderNotifications === 'function' && typeof notifications !== 'undefined') renderNotifications(notifications);
    if (typeof renderCurrentInstance === 'function' && typeof currentInstanceData !== 'undefined' && currentInstanceData) renderCurrentInstance(currentInstanceData);
    if (typeof update2FAMessage === 'function' && document.getElementById('modal2FA')?.style.display !== 'none') update2FAMessage();
    if (typeof renderMyProfileContent === 'function' && document.getElementById('modalMyProfile')?.style.display !== 'none') renderMyProfileContent();
    if (typeof renderVrcFriends === 'function' && typeof vrcFriendsLoaded !== 'undefined' && vrcFriendsLoaded) renderVrcFriends(vrcFriendsData);
    if (typeof currentFriendDetail !== 'undefined' && currentFriendDetail && typeof renderFriendDetail === 'function') renderFriendDetail(currentFriendDetail);
    if (typeof filterFavFriends === 'function' && typeof favFriendsData !== 'undefined') filterFavFriends();
    if (typeof renderModList === 'function' && typeof blockedData !== 'undefined' && blockedData !== null) renderModList('blockedList', blockedData, 'block');
    if (typeof renderModList === 'function' && typeof mutedData !== 'undefined' && mutedData !== null) renderModList('mutedList', mutedData, 'mute');
    if (typeof openStatusModal === 'function' && document.getElementById('modalStatus')?.style.display !== 'none' && currentVrcUser) openStatusModal();
    if (typeof refreshFriendInviteModalTranslations === 'function' && window._inviteModalEl) refreshFriendInviteModalTranslations();
    if (typeof refreshImagePickerTranslations === 'function' && document.getElementById('imagePickerOverlay')) refreshImagePickerTranslations();
    if (typeof renderWorldSearchDetail === 'function'
        && typeof _wdCurrentWorldId !== 'undefined'
        && _wdCurrentWorldId
        && typeof worldInfoCache !== 'undefined'
        && worldInfoCache[_wdCurrentWorldId]
        && document.getElementById('modalDetail')?.style.display !== 'none') {
        renderWorldSearchDetail(worldInfoCache[_wdCurrentWorldId]);
    }
}

// Generate settings page language buttons from the backend-provided language list
function renderLanguageChips() {
    const el = document.getElementById('languageGrid');
    if (!el) return;
    const buttons = Object.entries(UI_LANGUAGES).map(([key, meta]) => {
        const button = document.createElement('button');
        button.className = `theme-chip${currentLanguage === key ? ' active' : ''}`;
        button.addEventListener('click', () => selectLanguage(key));

        const flag = document.createElement('span');
        flag.className = 'theme-flag';
        flag.setAttribute('aria-hidden', 'true');
        flag.textContent = meta.flag;
        button.append(flag, document.createTextNode(meta.label));
        return button;
    });
    el.replaceChildren(...buttons);
}

function selectLanguage(language) {
    const nextLanguage = normalizeUiLanguage(language);
    if (nextLanguage === currentLanguage) return;
    currentLanguage = nextLanguage;
    renderLanguageChips();
    requestTranslation(nextLanguage);
    autoSave();
    const hint = document.getElementById('langRestartHint');
    if (hint) hint.style.display = '';
}
