/* === My Profile Modal === */
let _mypRawJson = null;
// My Profile Modal
function openMyProfileModal() {
    if (!currentVrcUser) return;
    const m = document.getElementById('modalMyProfile');
    if (!m) return;
    if (typeof navSetCurrent === 'function') navSetCurrent('myprofile', currentVrcUser.id || 'me');
    if (typeof navUpdateLabel === 'function') navUpdateLabel(currentVrcUser.displayName || '');
    renderMyProfileContent();
    m.style.display = 'flex';
    sendToCS({ action: 'vrcGetRepresentedGroup' });
}

function closeMyProfile(fromNav = false) {
    const m = document.getElementById('modalMyProfile');
    if (m) m.style.display = 'none';
    if (!fromNav && typeof navClear === 'function') navClear();
}

let _profileDecoData = { iconFrame: [], nameplateEffect: [], profileEffect: [] };

function openProfileDecoPicker() {
    let m = document.getElementById('profileDecoModal');
    if (!m) {
        m = document.createElement('div');
        m.id = 'profileDecoModal';
        m.className = 'modal-overlay';
        m.addEventListener('click', e => { if (e.target === m) closeProfileDecoPicker(); });
        document.body.appendChild(m);
    }
    m.style.display = 'flex';
    renderProfileDecoPicker(true);
    sendToCS({ action: 'vrcGetProfileDecorations' });
}

function closeProfileDecoPicker() {
    const m = document.getElementById('profileDecoModal');
    if (m) m.style.display = 'none';
}

function onProfileDecorations(data) {
    _profileDecoData = { iconFrame: [], nameplateEffect: [], profileEffect: [] };
    (data.decorations || []).forEach(d => { if (_profileDecoData[d.slot]) _profileDecoData[d.slot].push(d); });
    renderProfileDecoPicker(false);
}

function renderProfileDecoPicker(loading) {
    const m = document.getElementById('profileDecoModal');
    if (!m || m.style.display === 'none') return;
    const u = currentVrcUser || {};
    const slots = [
        { key: 'iconFrame',       label: t('profiles.deco.icon_frame', 'Icon Frame'),       cur: u.iconFrame || '' },
        { key: 'nameplateEffect', label: t('profiles.deco.nameplate', 'Nameplate'),         cur: u.nameplateEffect || '' },
        { key: 'profileEffect',   label: t('profiles.deco.profile_effect', 'Profile Effect'), cur: u.profileEffect || '' },
    ];
    const body = loading
        ? `<div class="pd-loading">${t('common.loading', 'Loading...')}</div>`
        : slots.map(s => {
            const items = _profileDecoData[s.key] || [];
            const noneCell = `<div class="pd-cell${!s.cur ? ' pd-sel' : ''}" onclick="setProfileDeco('${s.key}','')"><div class="pd-none"><span class="msi">block</span></div><div class="pd-name">${t('profiles.deco.none', 'None')}</div></div>`;
            const cells = items.map(it =>
                `<div class="pd-cell${it.templateId === s.cur ? ' pd-sel' : ''}" onclick="setProfileDeco('${s.key}','${jsq(it.templateId)}')" title="${esc(it.name)}"><img src="${esc(it.imageUrl)}" onerror="this.style.display='none'"><div class="pd-name">${esc(it.name)}</div></div>`
            ).join('');
            const empty = items.length === 0 ? `<div class="pd-empty">${t('profiles.deco.empty', 'You do not own any of these')}</div>` : '';
            return `<div class="pd-section"><div class="pd-section-title">${esc(s.label)}</div><div class="pd-grid">${noneCell}${cells}</div>${empty}</div>`;
        }).join('') + _mypThemeSection() + _mypBackgroundSection();
    m.innerHTML = `<div class="gp-modal" style="width:560px;max-width:92vw;max-height:80vh;display:flex;flex-direction:column;">
        <div class="gp-modal-header">
            <span class="msi" style="font-size:20px;color:var(--accent);">filter_frames</span>
            <span>${t('profiles.deco.title', 'Customize Profile')}</span>
            <button class="vrcn-button-round" onclick="closeProfileDecoPicker()" title="${esc(t('common.close', 'Close'))}"><span class="msi" style="font-size:18px;">close</span></button>
        </div>
        <div class="gp-modal-body" style="flex:1;overflow-y:auto;">${body}</div>
    </div>`;
}

function setProfileDeco(field, value) {
    if (currentVrcUser) currentVrcUser[field] = value;
    renderProfileDecoPicker(false);
    sendToCS({ action: 'vrcSetProfileDecoration', field, value });
}

function onSetProfileDecorationResult(data) {
    if (!data || !data.ok) { showToast(false, t('profiles.deco.failed', 'Could not update decoration')); return; }
    if (currentVrcUser) {
        currentVrcUser[data.field] = data.value;
        const urlField = data.field === 'iconFrame' ? 'iconFrameUrl' : (data.field === 'nameplateEffect' ? 'nameplateUrl' : 'profileEffectUrl');
        currentVrcUser[urlField] = data.url || '';
    }
    showToast(true, t('profiles.deco.updated', 'Profile updated!'));
    const mp = document.getElementById('modalMyProfile');
    if (mp && mp.style.display !== 'none' && typeof renderMyProfileContent === 'function') renderMyProfileContent();
}

function renderMyProfileContent() {
    const u = currentVrcUser;
    const box = document.getElementById('mypBox');
    if (!u || !box) return;

    if (typeof vrcnPlusOnProfileOpened === 'function' && u.id) {
        vrcnPlusOnProfileOpened(u.id, box);
    }

    const changeBannerTitle = t('profiles.my_profile.change_banner', 'Change banner');
    const addBannerTitle    = t('profiles.my_profile.add_banner', 'Add banner');
    const bannerLabel       = t('profiles.my_profile.banner', 'Banner');
    const changeIconTitle   = t('profiles.my_profile.change_icon', 'Change icon');
    const noLanguagesLabel  = t('profiles.my_profile.empty.no_languages', 'No languages set');
    const noLinksLabel      = t('profiles.my_profile.empty.no_links', 'No links added');
    const noPronounsLabel   = t('profiles.my_profile.empty.no_pronouns', 'No pronouns set');
    const noBioLabel        = t('profiles.my_profile.empty.no_bio', 'No bio written yet');
    const addLanguageLabel  = t('profiles.my_profile.add_language', 'Add language...');

    // Banner
    const bannerSrc = u.profilePicOverride || u.currentAvatarImageUrl || u.image || '';
    const _mypEffect = (typeof profileEffectHtml === 'function') ? profileEffectHtml(u.profileEffectUrl) : '';
    const bannerHtml = bannerSrc
        ? `<div class="fd-banner"><img src="${esc(bannerSrc)}" onerror="this.parentElement.style.display='none'"><div class="fd-banner-fade"></div>${_mypEffect}</div>`
        : `<div style="display:flex;justify-content:flex-end;padding:4px 0 2px 0;"><button class="myp-edit-btn" onclick="openImagePicker('profile-banner')" title="${esc(addBannerTitle)}"><span class="msi" style="font-size:13px;">edit</span><span style="font-size:11px;margin-left:3px;">${esc(bannerLabel)}</span></button></div>`;
    const mypHeaderActions = renderModalActions([
        { icon: 'edit', title: changeBannerTitle, onclick: `openImagePicker('profile-banner')`, header: true },
        { icon: 'filter_frames', title: t('profiles.deco.title', 'Customize Profile'), onclick: `openProfileDecoPicker()`, header: true },
        {
            label: 'VRCN+',
            title: t('vrcnplus.dropdown.title', 'VRCN+'),
            icon: 'auto_awesome',
            dropdown: [
                { icon: 'palette', label: t('vrcnplus.dropdown.customize_profile', 'Customize Profile'), onclick: 'openVrcnPlusEditor()' },
            ],
        },
        { icon: 'link_2', title: t('common.share', 'Share'), onclick: `navigator.clipboard.writeText('https://vrchat.com/home/user/${esc(u.id)}').then(()=>showToast(true,t('common.link_copied','Link copied!')))` },
        { icon: 'close', title: t('common.close', 'Close'), onclick: `closeMyProfile()`, header: true },
    ]);

    // Avatar with edit overlay
    const avatarImg = u.image
        ? `<img class="myp-avatar" src="${esc(u.image)}" onerror="this.outerHTML='<div class=\\'myp-avatar myp-avatar-fb\\'>${esc((u.displayName||'?')[0])}</div>'">`
        : `<div class="myp-avatar myp-avatar-fb">${esc((u.displayName||'?')[0])}</div>`;
    const _mypFrame = (typeof iconFrameHtml === 'function') ? iconFrameHtml(u.iconFrameUrl) : '';
    const imgTag = `<div style="position:relative;display:inline-block;flex-shrink:0;line-height:0;">${avatarImg}${_mypFrame}<button class="myp-edit-btn" style="position:absolute;bottom:-4px;right:-4px;z-index:4;padding:2px;min-width:0;width:18px;height:18px;display:flex;align-items:center;justify-content:center;" onclick="openImagePicker('profile-icon')" title="${esc(changeIconTitle)}"><span class="msi" style="font-size:11px;">edit</span></button></div>`;

    // Trust rank & badges row
    const rank = getTrustRank(u.tags || []);
    const vrcPlusBadge = (u.tags || []).includes('system_supporter') ? `<span class="vrcn-supporter-badge">VRC+</span>` : '';
    const platBadge = getPlatformBadgeHtml(u.platform || u.lastPlatform || '');
    let badgesRowHtml = '<div class="fd-badges-row">';
    if (platBadge) badgesRowHtml += platBadge;
    if (u.ageVerified) badgesRowHtml += `<span class="vrcn-badge ok"><span class="msi" style="font-size:11px;">verified</span>18+</span>`;
    if (rank) badgesRowHtml += `<span class="vrcn-badge ${rank.cls}">${esc(rank.label)}</span>`;
    if (u.id) badgesRowHtml += idBadge(u.id);
    badgesRowHtml += `<span class="vrcn-keybind" style="margin-left:auto;border-radius:5px;">CTRL P</span>`;
    badgesRowHtml += '</div>';

    // Representing group — prefer dedicated endpoint result, fall back to myGroups
    const _repG = myRepresentedGroup || ((typeof myGroups !== 'undefined') && myGroups.find(g => g.isRepresenting === true));
    let repGroupBadgeHtml = '';
    let repGroupCardHtml  = '';
    if (_repG) {
        const _rbi = _repG.iconUrl
            ? `<img class="fd-rep-group-badge-icon" src="${esc(_repG.iconUrl)}" onerror="this.style.display='none'">`
            : `<span class="msi" style="font-size:13px;flex-shrink:0;">group</span>`;
        repGroupBadgeHtml = `<div class="fd-rep-group-badge" onclick="closeMyProfile();openGroupDetail('${esc(_repG.id)}')">${_rbi}<span class="fd-rep-group-badge-name">${esc(_repG.name || '')}</span></div>`;
        const _ri = _repG.iconUrl
            ? `<img class="fd-group-icon" src="${esc(_repG.iconUrl)}" onerror="this.style.display='none'">`
            : `<div class="fd-group-icon fd-group-icon-empty"><span class="msi" style="font-size:18px;">group</span></div>`;
        repGroupCardHtml = `<div class="fd-info-card">
            <div class="fd-group-rep-label">${t('profiles.badges.representing', 'Representing')}</div>
            <div class="fd-group-card fd-group-rep" onclick="closeMyProfile();openGroupDetail('${esc(_repG.id)}')">
                ${_ri}<div class="fd-group-card-info"><div class="fd-group-card-name">${esc(_repG.name)}</div><div class="fd-group-card-meta">${esc(_repG.shortCode || '')}${_repG.discriminator ? '.' + esc(_repG.discriminator) : ''}${_repG.memberCount ? ' &middot; ' + esc(getGroupMemberText(_repG.memberCount)) : ''}</div></div>
            </div>
        </div>`;
    }

    const badges = u.badges || [];
    const _isVrcnPlus = (typeof vrcnPlusIsKnownPlus === 'function') && vrcnPlusIsKnownPlus(u.id);
    let _badgesCard = '';
    if (badges.length > 0 || _isVrcnPlus) {
        const vrcnPlusBadgeHtml = _isVrcnPlus && typeof window.vrcnPlusBadgeHtml === 'function'
            ? window.vrcnPlusBadgeHtml('myp-badge-item') : '';
        const iconsHtml = badges.map(b => {
            const hidden = !b.showcased;
            return `<div class="myp-badge-item fd-vrc-badge-wrap${hidden ? ' myp-badge-hidden' : ''}${_myBadgesEditing ? ' myp-badge-editing' : ''}" data-badge-id="${esc(b.id)}" data-badge-img="${esc(b.imageUrl)}" data-badge-name="${encodeURIComponent(b.name)}" data-badge-desc="${encodeURIComponent(b.description || '')}" onclick="${_myBadgesEditing ? `toggleMyBadge('${esc(b.id)}')` : ''}"><img class="fd-vrc-badge-icon" src="${esc(b.imageUrl)}" alt="${esc(b.name)}" onerror="this.closest('.myp-badge-item').style.display='none'"></div>`;
        }).join('');
        _badgesCard = `<div class="fd-info-card">
            <div class="fd-group-rep-label" style="display:flex;align-items:center;justify-content:space-between;">${t('profiles.my_profile.sections.badges', 'Badges')}<button class="myp-edit-btn" onclick="toggleBadgeEditMode()"><span class="msi" style="font-size:14px;">${_myBadgesEditing ? 'check' : 'edit'}</span></button></div>
            <div class="myp-badges-row">${vrcnPlusBadgeHtml}${iconsHtml}</div>
        </div>`;
    }

    // Biography card (left) — bio, links, languages each editable
    const langTags = (u.tags||[]).filter(t => t.startsWith('language_'));
    const langsViewHtml = langTags.length
        ? `<div class="fd-lang-tags">${langTags.map(t => `<span class="vrcn-badge">${esc(LANG_MAP[t]||t.replace('language_','').toUpperCase())}</span>`).join('')}</div>`
        : `<div class="myp-empty">${noLanguagesLabel}</div>`;
    const bioLinksViewHtml = (u.bioLinks||[]).length
        ? `<div class="fd-bio-links">${u.bioLinks.map(bl => renderBioLink(bl)).join('')}</div>`
        : `<div class="myp-empty">${noLinksLabel}</div>`;
    const _bioCard = `<div class="fd-info-card">
        <div class="myp-section-header">
            <span class="myp-section-title">${t('profiles.my_profile.sections.bio', 'Bio')}</span>
            <button class="myp-edit-btn" onclick="editMyField('bio')"><span class="msi" style="font-size:14px;">edit</span></button>
        </div>
        <div id="mypBioView">${u.bio ? `<div class="fd-bio">${esc(u.bio)}</div>` : `<div class="myp-empty">${noBioLabel}</div>`}</div>
        <div id="mypBioEdit" style="display:none;">
            <textarea id="mypBioInput" class="myp-textarea" rows="4" maxlength="512" placeholder="${esc(t('profiles.my_profile.bio_placeholder', 'Write your bio...'))}">${esc(u.bio||'')}</textarea>
            <div class="myp-char-count"><span id="mypBioCount">${(u.bio||'').length}</span>/512</div>
            <div class="myp-edit-actions">
                <button class="vrcn-button" onclick="cancelMyField('bio')">${t('common.cancel', 'Cancel')}</button>
                <button class="vrcn-button vrcn-btn-primary" onclick="saveMyField('bio')">${t('common.save', 'Save')}</button>
            </div>
        </div>
        <div class="myp-section-header" style="margin-top:10px;">
            <span class="myp-section-title">${t('profiles.my_profile.sections.links', 'Links')}</span>
            <button class="myp-edit-btn" onclick="editMyField('links')"><span class="msi" style="font-size:14px;">edit</span></button>
        </div>
        <div id="mypLinksView">${bioLinksViewHtml}</div>
        <div id="mypLinksEdit" style="display:none;">
            <div id="mypLinksInputs"></div>
            <div class="myp-edit-actions">
                <button class="vrcn-button" onclick="cancelMyField('links')">${t('common.cancel', 'Cancel')}</button>
                <button class="vrcn-button vrcn-btn-primary" onclick="saveMyField('links')">${t('common.save', 'Save')}</button>
            </div>
        </div>
        <div class="myp-section-header" style="margin-top:10px;">
            <span class="myp-section-title">${t('profiles.my_profile.sections.languages', 'Languages')}</span>
            <button class="myp-edit-btn" onclick="editMyField('languages')"><span class="msi" style="font-size:14px;">edit</span></button>
        </div>
        <div id="mypLangsView">${langsViewHtml}</div>
        <div id="mypLangsEdit" style="display:none;">
            <div id="mypLangsChips" class="myp-lang-chips"></div>
            <div class="myp-lang-add-row">
                <select id="mypLangSelect" class="myp-lang-select"><option value="">${addLanguageLabel}</option></select>
                <button class="myp-add-lang-btn" onclick="addMyLanguage()"><span class="msi" style="font-size:15px;">add</span></button>
            </div>
            <div class="myp-edit-actions">
                <button class="vrcn-button" onclick="cancelMyField('languages')">${t('common.cancel', 'Cancel')}</button>
                <button class="vrcn-button vrcn-btn-primary" onclick="saveMyField('languages')">${t('common.save', 'Save')}</button>
            </div>
        </div>
    </div>`;

    // Infos card (right) — platform, joined date, pronouns
    const _mr = (label, valueHtml) =>
        `<div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline;font-size:11px;"><span style="color:var(--tx3);">${label}</span><span style="color:var(--tx1);text-align:right;">${valueHtml}</span></div>`;
    const _infosRows = [
        _mr(t('profiles.meta.joined',        'Joined'),         u.dateJoined  ? fmtShortDate(new Date(u.dateJoined + 'T00:00:00')) : '—'),
        _mr(t('profiles.meta.last_login',    'Last Login'),     u.lastLogin   ? fmtShortDate(new Date(u.lastLogin)) : '—'),
        _mr(t('profiles.meta.platform',      'Platform'),       esc(u.platform || u.lastPlatform || '—')),
        _mr(t('profiles.meta.last_platform', 'Last Platform'),  esc(u.lastPlatform || '—')),
        _mr(t('profiles.meta.age_verified',  'Age Verified'),   u.ageVerified       ? t('common.yes','Yes') : t('common.no','No')),
        _mr(t('profiles.meta.avatar_cloning','Avatar Cloning'), u.allowAvatarCopying ? t('common.on','On')  : t('common.off','Off')),
        _mr(t('profiles.meta.booping',       'Booping'),        u.isBoopingEnabled   ? t('common.on','On')  : t('common.off','Off')),
    ].join('');
    const _infosCard = `<div class="fd-info-card">
        <div class="fd-group-rep-label">${t('profiles.meta.infos_title', 'Infos')}</div>
        <div style="display:grid;gap:6px;margin-bottom:10px;">${_infosRows}</div>
        <div class="myp-section-header">
            <span class="myp-section-title">${t('profiles.my_profile.sections.pronouns', 'Pronouns')}</span>
            <button class="myp-edit-btn" onclick="editMyField('pronouns')"><span class="msi" style="font-size:14px;">edit</span></button>
        </div>
        <div id="mypPronounsView">${u.pronouns ? `<div style="font-size:13px;color:var(--tx1);">${esc(u.pronouns)}</div>` : `<div class="myp-empty">${noPronounsLabel}</div>`}</div>
        <div id="mypPronounsEdit" style="display:none;">
            <input type="text" id="mypPronounsInput" class="vrcn-edit-field" placeholder="${esc(t('profiles.my_profile.pronouns_placeholder', 'e.g. he/him, she/her, they/them...'))}" maxlength="32" value="${esc(u.pronouns||'')}" style="width:100%;">
            <div class="myp-edit-actions">
                <button class="vrcn-button" onclick="cancelMyField('pronouns')">${t('common.cancel', 'Cancel')}</button>
                <button class="vrcn-button vrcn-btn-primary" onclick="saveMyField('pronouns')">${t('common.save', 'Save')}</button>
            </div>
        </div>
    </div>`;

    // Trust & Safety card (right)
    const _trustCard = rank ? `<div class="fd-info-card">
        <div class="fd-group-rep-label">${t('profiles.trust.title', 'Trust &amp; Safety')}</div>
        <span class="vrcn-badge ${rank.cls}">${esc(rank.label)}</span>
        <p style="margin:10px 0 0;font-size:12px;color:var(--tx3);line-height:1.45;">${t('profiles.trust.description', 'This user has a trusted user standing within the community.')}</p>
    </div>` : '';

    const pronounsHtml = u.pronouns ? `<div class="fd-pronouns">${esc(u.pronouns)}</div>` : '';

    box.innerHTML = `
        ${mypHeaderActions}
        ${bannerHtml}
        <div class="fd-content${bannerSrc ? ' fd-has-banner' : ''}">
            <div class="fd-header">
                ${imgTag}
                <div>
                    <div class="fd-name" style="display:flex;align-items:center;gap:6px;">${esc(u.displayName)}${vrcPlusBadge}</div>
                    ${pronounsHtml}
                    <div class="fd-status-row">
                        <div class="myp-status-row" onclick="openStatusModal()">
                            <span class="vrc-status-dot ${statusDotClass(u.status)}" style="width:7px;height:7px;flex-shrink:0;"></span>
                            <span>${getStatusText(u.status, u.statusDescription)}</span>
                            <span class="msi" style="font-size:13px;opacity:.45;">edit</span>
                        </div>
                    </div>
                    ${repGroupBadgeHtml}
                </div>
            </div>
            ${badgesRowHtml}
            <div class="fd-tabs" style="margin-bottom:14px;">
                <button class="fd-tab active" onclick="switchMypTab('info',this)">${t('profiles.tabs.info', 'Info')}</button>
                <button class="fd-tab" onclick="switchMypTab('json',this)">Json</button>
            </div>
            <div id="mypTabInfo">
                <div class="fd-info-wrap" style="margin-top:10px;">
                    <div class="fd-info-cols">
                        <div class="fd-info-left">
                            ${_badgesCard}${_bioCard}
                        </div>
                        <div class="fd-info-right">
                            ${repGroupCardHtml}${_infosCard}${_trustCard}
                        </div>
                    </div>
                </div>
            </div>
            <div id="mypTabJson" style="display:none;"><div class="json-viewer">${jsonHighlight(_mypRawJson || {})}</div></div>
        </div>`;

    const bioInput = document.getElementById('mypBioInput');
    if (bioInput) bioInput.oninput = () => {
        const cnt = document.getElementById('mypBioCount');
        if (cnt) cnt.textContent = bioInput.value.length;
    };

    // Own VRC+ profile background, same treatment as other profiles.
    if (typeof applyProfileBg === 'function') applyProfileBg(box, u);
    if (typeof applyProfileTheme === 'function') applyProfileTheme(box, u);
}

let _myBadgesEditing = false;

function _renderMyBadgesSection(u) {
    const badges = u.badges || [];
    if (badges.length === 0) return '';
    const noBadgesLabel = t('profiles.my_profile.empty.no_badges', 'No badges');
    const badgesTitle = t('profiles.my_profile.sections.badges', 'Badges');
    const iconsHtml = badges.map(b => {
        const hidden = !b.showcased;
        return `<div class="myp-badge-item fd-vrc-badge-wrap${hidden ? ' myp-badge-hidden' : ''}${_myBadgesEditing ? ' myp-badge-editing' : ''}" data-badge-id="${esc(b.id)}" data-badge-img="${esc(b.imageUrl)}" data-badge-name="${encodeURIComponent(b.name)}" data-badge-desc="${encodeURIComponent(b.description || '')}" onclick="${_myBadgesEditing ? `toggleMyBadge('${esc(b.id)}')` : ''}"><img class="fd-vrc-badge-icon" src="${esc(b.imageUrl)}" alt="${esc(b.name)}" onerror="this.closest('.myp-badge-item').style.display='none'"></div>`;
    }).join('');
    return `<div class="myp-section">
        <div class="myp-section-header">
            <span class="myp-section-title">${badgesTitle}</span>
            <button class="myp-edit-btn" onclick="toggleBadgeEditMode()"><span class="msi" style="font-size:14px;">${_myBadgesEditing ? 'check' : 'edit'}</span></button>
        </div>
        <div class="myp-badges-row">${iconsHtml}</div>
    </div>`;
}

function toggleBadgeEditMode() {
    _myBadgesEditing = !_myBadgesEditing;
    renderMyProfileContent();
}

function toggleMyBadge(badgeId) {
    if (!currentVrcUser?.badges) return;
    const b = currentVrcUser.badges.find(x => x.id === badgeId);
    if (!b) return;
    const newShowcased = !b.showcased;
    // Optimistic update
    b.showcased = newShowcased;
    const wrap = document.querySelector(`.myp-badge-item[data-badge-id="${badgeId}"]`);
    if (wrap) wrap.classList.toggle('myp-badge-hidden', !newShowcased);
    sendToCS({ action: 'vrcUpdateBadge', badgeId, showcased: newShowcased });
}

function editMyField(field) {
    const VIEWS = { pronouns: 'mypPronounsView', bio: 'mypBioView', links: 'mypLinksView', languages: 'mypLangsView' };
    const EDITS = { pronouns: 'mypPronounsEdit', bio: 'mypBioEdit', links: 'mypLinksEdit', languages: 'mypLangsEdit' };
    // Close other open edit panels
    Object.keys(VIEWS).forEach(f => {
        if (f !== field) {
            const v = document.getElementById(VIEWS[f]); if (v) v.style.display = '';
            const e = document.getElementById(EDITS[f]); if (e) e.style.display = 'none';
        }
    });
    const viewEl = document.getElementById(VIEWS[field]);
    const editEl = document.getElementById(EDITS[field]);
    if (viewEl) viewEl.style.display = 'none';
    if (editEl) editEl.style.display = '';

    if (field === 'pronouns') {
        const inp = document.getElementById('mypPronounsInput');
        if (inp) { inp.value = currentVrcUser.pronouns || ''; inp.focus(); }
    } else if (field === 'bio') {
        const inp = document.getElementById('mypBioInput');
        if (inp) { inp.focus(); const cnt = document.getElementById('mypBioCount'); if (cnt) cnt.textContent = inp.value.length; }
    } else if (field === 'links') {
        _renderMyLinksInputs();
    } else if (field === 'languages') {
        _renderMyLangsEdit();
    }
}

function cancelMyField(field) {
    const VIEWS = { pronouns: 'mypPronounsView', bio: 'mypBioView', links: 'mypLinksView', languages: 'mypLangsView' };
    const EDITS = { pronouns: 'mypPronounsEdit', bio: 'mypBioEdit', links: 'mypLinksEdit', languages: 'mypLangsEdit' };
    const v = document.getElementById(VIEWS[field]); if (v) v.style.display = '';
    const e = document.getElementById(EDITS[field]); if (e) e.style.display = 'none';
}

function saveMyField(field) {
    const u = currentVrcUser;
    if (!u) return;
    const EDITS = { pronouns: 'mypPronounsEdit', bio: 'mypBioEdit', links: 'mypLinksEdit', languages: 'mypLangsEdit' };
    const saveBtn = document.querySelector(`#${EDITS[field]} .vrcn-btn-primary`);
    if (saveBtn) saveBtn.disabled = true;

    if (field === 'pronouns') {
        const pronouns = document.getElementById('mypPronounsInput')?.value ?? '';
        sendToCS({ action: 'vrcUpdateProfile', pronouns });
    } else if (field === 'bio') {
        const bio = document.getElementById('mypBioInput')?.value ?? '';
        sendToCS({ action: 'vrcUpdateProfile', bio });
    } else if (field === 'links') {
        const inputs = document.querySelectorAll('#mypLinksInputs .vrcn-edit-field');
        const bioLinks = Array.from(inputs).map(i => i.value.trim()).filter(Boolean).slice(0, 3);
        sendToCS({ action: 'vrcUpdateProfile', bioLinks });
    } else if (field === 'languages') {
        const chips = document.querySelectorAll('#mypLangsChips [data-lang]');
        const selectedLangs = Array.from(chips).map(c => c.dataset.lang);
        const nonLangTags = (u.tags||[]).filter(t => !t.startsWith('language_'));
        sendToCS({ action: 'vrcUpdateProfile', tags: [...nonLangTags, ...selectedLangs] });
    }
}

function _renderMyLinksInputs() {
    const container = document.getElementById('mypLinksInputs');
    if (!container) return;
    const links = currentVrcUser.bioLinks || [];
    container.innerHTML = [0, 1, 2].map(i =>
        `<div class="myp-link-row">
            <span class="myp-link-num">${i + 1}</span>
            <input type="url" class="vrcn-edit-field" placeholder="https://..." value="${esc(links[i]||'')}" maxlength="512" style="flex:1;">
        </div>`
    ).join('');
}

function _renderMyLangsEdit() {
    const selectedLangs = (currentVrcUser.tags||[]).filter(t => t.startsWith('language_'));
    _renderMyLangChips(selectedLangs, document.getElementById('mypLangsChips'));
    const sel = document.getElementById('mypLangSelect');
    if (!sel) return;
    sel.innerHTML = `<option value="">${t('profiles.my_profile.add_language', 'Add language...')}</option>`;
    Object.entries(LANG_MAP).forEach(([key, name]) => {
        if (!selectedLangs.includes(key))
            sel.insertAdjacentHTML('beforeend', `<option value="${key}">${esc(name)}</option>`);
    });
}

function _renderMyLangChips(langs, el) {
    if (!el) return;
    el.innerHTML = langs.map(tag =>
        `<span class="myp-lang-chip" data-lang="${tag}">${esc(LANG_MAP[tag]||tag.replace('language_','').toUpperCase())}<button class="myp-lang-remove" onclick="removeMyLanguage('${tag}')"><span class="msi" style="font-size:11px;">close</span></button></span>`
    ).join('');
}

function addMyLanguage() {
    const sel = document.getElementById('mypLangSelect');
    const key = sel?.value;
    if (!key) return;
    const chips = Array.from(document.querySelectorAll('#mypLangsChips [data-lang]')).map(c => c.dataset.lang);
    if (chips.includes(key)) return;
    chips.push(key);
    _renderMyLangChips(chips, document.getElementById('mypLangsChips'));
    const opt = sel.querySelector(`option[value="${key}"]`);
    if (opt) opt.remove();
    sel.value = '';
}

function removeMyLanguage(tag) {
    const chips = Array.from(document.querySelectorAll('#mypLangsChips [data-lang]')).map(c => c.dataset.lang).filter(t => t !== tag);
    _renderMyLangChips(chips, document.getElementById('mypLangsChips'));
    const sel = document.getElementById('mypLangSelect');
    if (sel) sel.insertAdjacentHTML('beforeend', `<option value="${tag}">${esc(LANG_MAP[tag]||tag.replace('language_','').toUpperCase())}</option>`);
}



function switchMypTab(tab, btn) {
    const infoEl = document.getElementById('mypTabInfo');
    const jsonEl = document.getElementById('mypTabJson');
    if (infoEl) infoEl.style.display = tab === 'info' ? '' : 'none';
    if (jsonEl) jsonEl.style.display = tab === 'json' ? '' : 'none';
    document.querySelectorAll('#mypBox .fd-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

function openStatusModal() {
    if (!currentVrcUser) return;
    selectedStatus = currentVrcUser.status || 'active';
    const m = document.getElementById('modalStatus');
    const opts = document.getElementById('statusOptions');
    opts.innerHTML = STATUS_LIST.map(s =>
        `<div class="status-option${selectedStatus === s.key ? ' selected' : ''}" data-status-key="${s.key}" onclick="selectStatusOption('${s.key}')"><div class="status-option-dot" style="background:${s.color}"></div><div><div class="status-option-label">${t(s.labelKey || '', s.label)}</div><div class="status-option-desc">${t(s.descKey || '', s.desc)}</div></div></div>`
    ).join('');

    const curDesc = currentVrcUser.statusDescription || '';
    const history = Array.isArray(currentVrcUser.statusHistory) ? currentVrcUser.statusHistory : [];
    const seen = new Set();
    const entries = [];
    [curDesc, ...history].forEach(s => {
        const v = (s || '').trim();
        if (!v || seen.has(v)) return;
        seen.add(v);
        entries.push(v);
    });

    const sel = document.getElementById('statusDescSelect');
    sel.innerHTML = `<option value="">${esc(t('profiles.status.no_message', 'No status message'))}</option>`
        + entries.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join('');
    sel.value = curDesc && entries.includes(curDesc) ? curDesc : '';
    sel.onchange = () => updateStatusDescCount(sel.value.length);
    if (typeof initVnSelect === 'function') {
        initVnSelect(sel);
        if (sel._vnRefresh) sel._vnRefresh();
    }

    const inp = document.getElementById('statusDescInput');
    inp.value = curDesc;
    inp.oninput = () => updateStatusDescCount(inp.value.length);

    // Default to the dropdown. Fall back to free-text only when there are no recent statuses.
    setStatusDescMode(entries.length === 0);
    updateStatusDescCount((entries.length === 0 ? inp.value : sel.value).length);
    m.style.display = 'flex';
}

function updateStatusDescCount(len) {
    document.getElementById('statusDescCount').textContent = (len || 0) + '/32';
}

function setStatusDescMode(textMode) {
    const sel = document.getElementById('statusDescSelect');
    const inp = document.getElementById('statusDescInput');
    const btn = document.getElementById('statusDescEditBtn');
    const wrap = sel.parentElement && sel.parentElement.classList.contains('vn-select') ? sel.parentElement : sel;
    wrap.style.display = textMode ? 'none' : '';
    inp.style.display = textMode ? '' : 'none';
    btn.classList.toggle('active', textMode);
    if (textMode) setTimeout(() => inp.focus(), 50);
}

function toggleStatusDescEdit() {
    const inp = document.getElementById('statusDescInput');
    const sel = document.getElementById('statusDescSelect');
    const goingToText = inp.style.display === 'none';
    if (goingToText) {
        inp.value = sel.value;
        updateStatusDescCount(inp.value.length);
    } else {
        updateStatusDescCount(sel.value.length);
    }
    setStatusDescMode(goingToText);
}

function selectStatusOption(key) {
    selectedStatus = key;
    document.querySelectorAll('.status-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.statusKey === key);
    });
}

function submitStatusChange() {
    const inp = document.getElementById('statusDescInput');
    const sel = document.getElementById('statusDescSelect');
    const textMode = inp.style.display !== 'none';
    const desc = (textMode ? inp.value : sel.value).trim();
    sendToCS({ action: 'vrcUpdateStatus', status: selectedStatus, statusDescription: desc });
    document.getElementById('modalStatus').style.display = 'none';
}

// VRC+ profile background. Written through PUT profile/{userId}, which is a different
// endpoint from the decoration slots above, hence its own action.
function _mypBackgroundSection() {
    if (typeof PROFILE_BG_FILES === 'undefined') return '';
    const u = currentVrcUser || {};
    const type = u.backgroundType || 'default';
    const curTex = type === 'texture' ? (u.backgroundTextureId || '') : '';

    const noneCell = `<div class="pd-cell${type === 'default' ? ' pd-sel' : ''}" onclick="setProfileBackground('default')"><div class="pd-none"><span class="msi">block</span></div><div class="pd-name">${t('profiles.deco.none', 'None')}</div></div>`;

    const gradCell = `<div class="pd-cell${type === 'gradient' ? ' pd-sel' : ''}" onclick="setProfileBackgroundGradient()" title="${esc(t('profiles.deco.gradient', 'Gradient'))}"><div class="pd-none" style="background:linear-gradient(180deg,${esc(u.backgroundGradientTop || '#5d3f86')},${esc(u.backgroundGradientBottom || '#21385b')});"></div><div class="pd-name">${esc(t('profiles.deco.gradient', 'Gradient'))}</div></div>`;

    const texCells = Object.keys(PROFILE_BG_FILES).map(id => {
        const url = PROFILE_BG_ASSET_URL + PROFILE_BG_FILES[id];
        const label = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return `<div class="pd-cell${curTex === id ? ' pd-sel' : ''}" onclick="setProfileBackground('texture','${jsq(id)}')" title="${esc(label)}"><img src="${esc(url)}" loading="lazy" onerror="this.style.display='none'"><div class="pd-name">${esc(label)}</div></div>`;
    }).join('');

    return `<div class="pd-section"><div class="pd-section-title">${esc(t('profiles.deco.background', 'Profile Background'))}</div><div class="pd-grid">${noneCell}${gradCell}${texCells}</div></div>`;
}

function setProfileBackground(type, textureId) {
    if (currentVrcUser) {
        currentVrcUser.backgroundType = type;
        currentVrcUser.backgroundTextureId = type === 'texture' ? (textureId || '') : '';
    }
    renderProfileDecoPicker(false);
    sendToCS({ action: 'vrcUpdateProfileBackground', backgroundType: type, backgroundTextureId: textureId || '' });
}

let _pbgGradTop = '#5d3f86';
let _pbgGradBottom = '#21385b';

function _pbgHex(v, fallback) {
    const c = String(v || '').trim().replace(/^#/, '');
    return /^[0-9a-f]{6}$/i.test(c) ? '#' + c.toLowerCase() : fallback;
}

// Gradient editor in the same shell as the decoration picker, with a live preview so
// the two colours can be judged together rather than one hex field at a time.
function setProfileBackgroundGradient() {
    const u = currentVrcUser || {};
    _pbgGradTop    = _pbgHex(u.backgroundGradientTop, '#5d3f86');
    _pbgGradBottom = _pbgHex(u.backgroundGradientBottom, '#21385b');

    let m = document.getElementById('profileGradModal');
    if (m) m.remove();
    m = document.createElement('div');
    m.className = 'modal-overlay';
    m.id = 'profileGradModal';
    m.style.zIndex = '10004';
    m.style.display = 'flex';
    m.innerHTML = `<div class="gp-modal" style="width:380px;max-width:92vw;">
        <div class="gp-modal-header">
            <span class="msi" style="font-size:20px;color:var(--accent);">gradient</span>
            <span>${esc(t('profiles.deco.gradient', 'Gradient'))}</span>
            <button class="vrcn-button-round" onclick="closeProfileGradPicker()" title="${esc(t('common.close', 'Close'))}"><span class="msi" style="font-size:18px;">close</span></button>
        </div>
        <div class="gp-modal-body">
            <div id="pbgPreview" class="pbg-preview"></div>
            <div class="pbg-row">
                <span class="pbg-label">${esc(t('profiles.deco.gradient_top', 'Top'))}</span>
                <input type="color" id="pbgTopColor" class="pbg-swatch" value="${esc(_pbgGradTop)}" oninput="pbgSetGrad('top', this.value)">
                <input type="text" id="pbgTopHex" class="vrcn-edit-field pbg-hex" maxlength="7" value="${esc(_pbgGradTop)}" oninput="pbgSetGrad('top', this.value)">
            </div>
            <div class="pbg-row">
                <span class="pbg-label">${esc(t('profiles.deco.gradient_bottom', 'Bottom'))}</span>
                <input type="color" id="pbgBottomColor" class="pbg-swatch" value="${esc(_pbgGradBottom)}" oninput="pbgSetGrad('bottom', this.value)">
                <input type="text" id="pbgBottomHex" class="vrcn-edit-field pbg-hex" maxlength="7" value="${esc(_pbgGradBottom)}" oninput="pbgSetGrad('bottom', this.value)">
            </div>
        </div>
        <div class="modal-btns" style="padding:0 16px 16px;">
            <button class="vrcn-button" onclick="closeProfileGradPicker()">${esc(t('common.cancel', 'Cancel'))}</button>
            <button class="vrcn-button vrcn-btn-primary" onclick="applyProfileGradient()">${esc(t('common.apply', 'Apply'))}</button>
        </div>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) closeProfileGradPicker(); });
    _pbgRenderPreview();
}

function _pbgRenderPreview() {
    const el = document.getElementById('pbgPreview');
    if (el) el.style.background = `linear-gradient(180deg, ${_pbgGradTop}, ${_pbgGradBottom})`;
}

function pbgSetGrad(which, value) {
    const cur = which === 'top' ? _pbgGradTop : _pbgGradBottom;
    const hex = _pbgHex(value, cur);
    if (which === 'top') _pbgGradTop = hex; else _pbgGradBottom = hex;

    const colorEl = document.getElementById(which === 'top' ? 'pbgTopColor' : 'pbgBottomColor');
    const hexEl   = document.getElementById(which === 'top' ? 'pbgTopHex'   : 'pbgBottomHex');
    if (colorEl) colorEl.value = hex;
    // Leave the text field alone while it is being typed in, otherwise the caret jumps.
    if (hexEl && document.activeElement !== hexEl) hexEl.value = hex;
    _pbgRenderPreview();
}

function closeProfileGradPicker() {
    document.getElementById('profileGradModal')?.remove();
}

function applyProfileGradient() {
    if (currentVrcUser) {
        currentVrcUser.backgroundType = 'gradient';
        currentVrcUser.backgroundGradientTop = _pbgGradTop;
        currentVrcUser.backgroundGradientBottom = _pbgGradBottom;
    }
    closeProfileGradPicker();
    renderProfileDecoPicker(false);
    sendToCS({
        action: 'vrcUpdateProfileBackground',
        backgroundType: 'gradient',
        backgroundGradientTop: _pbgGradTop,
        backgroundGradientBottom: _pbgGradBottom,
    });
}

function onProfileBackgroundUpdated(data) {
    if (!data?.success) { showToast(false, t('profiles.deco.failed', 'Could not update decoration')); return; }
    if (currentVrcUser) Object.assign(currentVrcUser, {
        backgroundType:           data.backgroundType || 'default',
        backgroundTextureId:      data.backgroundTextureId || '',
        backgroundTextureUrl:     data.backgroundTextureUrl || '',
        backgroundGradientTop:    data.backgroundGradientTop || '',
        backgroundGradientBottom: data.backgroundGradientBottom || '',
    });
    showToast(true, t('profiles.deco.updated', 'Profile updated!'));
    if (typeof renderMyProfileContent === 'function') renderMyProfileContent();
    renderProfileDecoPicker(false);
}

function _mypThemeSection() {
    if (typeof profileThemeStripes !== 'function') return '';
    const u = currentVrcUser || {};
    const themes = Array.isArray(u.themes) ? u.themes : [];
    const cur = u.themeId || '';

    const noneCell = `<div class="pd-cell${!cur ? ' pd-sel' : ''}" onclick="setActiveProfileTheme('')"><div class="pd-none"><span class="msi">block</span></div><div class="pd-name">${t('profiles.deco.none', 'None')}</div></div>`;

    const cells = themes.map(th => `<div class="pd-cell${th.id === cur ? ' pd-sel' : ''}" title="${esc(th.name || '')}">
        <div onclick="setActiveProfileTheme('${jsq(th.id)}')">${profileThemeStripes(th)}<div class="pd-name">${esc(th.name || t('profiles.theme.unnamed', 'Unnamed'))}</div></div>
        <div class="pt-cell-actions">
            <button class="vrcn-button" style="padding:2px 6px;" onclick="event.stopPropagation();openProfileThemeEditor('${jsq(th.id)}')"><span class="msi" style="font-size:13px;">edit</span></button>
            <button class="vrcn-button" style="padding:2px 6px;" onclick="event.stopPropagation();deleteProfileTheme('${jsq(th.id)}')"><span class="msi" style="font-size:13px;">delete</span></button>
        </div>
    </div>`).join('');

    const addCell = `<div class="pd-cell" onclick="openProfileThemeEditor('')"><div class="pd-none"><span class="msi">add</span></div><div class="pd-name">${t('profiles.theme.add', 'New Theme')}</div></div>`;

    return `<div class="pd-section"><div class="pd-section-title">${esc(t('profiles.theme.title', 'Profile Theme'))}</div><div class="pd-grid">${noneCell}${cells}${addCell}</div></div>`;
}

function setActiveProfileTheme(themeId) {
    if (currentVrcUser) currentVrcUser.themeId = themeId;
    _mypApplyActiveThemeColors();
    renderProfileDecoPicker(false);
    sendToCS({ action: 'vrcSetActiveProfileTheme', themeId });
}

function _mypApplyActiveThemeColors() {
    const u = currentVrcUser;
    if (!u) return;
    const th = (Array.isArray(u.themes) ? u.themes : []).find(x => x.id === u.themeId);
    u.themeButtonColor  = th ? (th.buttonColor  || '') : '';
    u.themeIconColor    = th ? (th.iconColor    || '') : '';
    u.themeSubtextColor = th ? (th.subtextColor || '') : '';
    if (typeof renderMyProfileContent === 'function') renderMyProfileContent();
}

let _ptEditId = '';
let _ptEditColors = { button: '#064b5c', icon: '#6ae3f9', subtext: '#a9a9a9' };

function openProfileThemeEditor(themeId) {
    const u = currentVrcUser || {};
    const th = (Array.isArray(u.themes) ? u.themes : []).find(x => x.id === themeId);
    _ptEditId = themeId || '';
    _ptEditColors = {
        button:  ptHex(th && th.buttonColor,  '#064b5c'),
        icon:    ptHex(th && th.iconColor,    '#6ae3f9'),
        subtext: ptHex(th && th.subtextColor, '#a9a9a9'),
    };

    document.getElementById('profileThemeModal')?.remove();
    const m = document.createElement('div');
    m.className = 'modal-overlay';
    m.id = 'profileThemeModal';
    m.style.zIndex = '10004';
    m.style.display = 'flex';

    const rows = [
        ['button',  t('profiles.theme.button_color',  'Button')],
        ['icon',    t('profiles.theme.icon_color',    'Icons')],
        ['subtext', t('profiles.theme.subtext_color', 'Text')],
    ].map(pair => `<div class="pt-row">
        <span class="pt-label">${esc(pair[1])}</span>
        <input type="color" id="ptColor_${pair[0]}" class="pbg-swatch" value="${esc(_ptEditColors[pair[0]])}" oninput="ptSetColor('${pair[0]}', this.value)">
        <input type="text" id="ptHex_${pair[0]}" class="vrcn-edit-field pbg-hex" maxlength="7" value="${esc(_ptEditColors[pair[0]])}" oninput="ptSetColor('${pair[0]}', this.value)">
    </div>`).join('');

    m.innerHTML = `<div class="gp-modal" style="width:400px;max-width:92vw;">
        <div class="gp-modal-header">
            <span class="msi" style="font-size:20px;color:var(--accent);">palette</span>
            <span>${esc(themeId ? t('profiles.theme.edit', 'Edit Theme') : t('profiles.theme.add', 'New Theme'))}</span>
            <button class="vrcn-button-round" onclick="closeProfileThemeEditor()" title="${esc(t('common.close', 'Close'))}"><span class="msi" style="font-size:18px;">close</span></button>
        </div>
        <div class="gp-modal-body">
            <div class="pt-preview" id="ptPreview"></div>
            <div class="pt-row">
                <span class="pt-label">${esc(t('profiles.theme.name', 'Name'))}</span>
                <input type="text" id="ptName" class="vrcn-edit-field" style="flex:1;" maxlength="32" value="${esc((th && th.name) || '')}">
            </div>
            ${rows}
        </div>
        <div class="modal-btns" style="padding:0 16px 16px;">
            <button class="vrcn-button" onclick="closeProfileThemeEditor()">${esc(t('common.cancel', 'Cancel'))}</button>
            <button class="vrcn-button vrcn-btn-primary" onclick="saveProfileThemeFromEditor()">${esc(t('common.save', 'Save'))}</button>
        </div>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) closeProfileThemeEditor(); });
    _ptRenderPreview();
}

function _ptRenderPreview() {
    const el = document.getElementById('ptPreview');
    if (el) el.innerHTML = profileThemeStripes({
        buttonColor: _ptEditColors.button,
        iconColor: _ptEditColors.icon,
        subtextColor: _ptEditColors.subtext,
    });
}

function ptSetColor(key, value) {
    const hex = ptHex(value, _ptEditColors[key]);
    _ptEditColors[key] = hex;
    const c = document.getElementById('ptColor_' + key);
    const h = document.getElementById('ptHex_' + key);
    if (c) c.value = hex;
    if (h && document.activeElement !== h) h.value = hex;
    _ptRenderPreview();
}

function closeProfileThemeEditor() {
    document.getElementById('profileThemeModal')?.remove();
}

function saveProfileThemeFromEditor() {
    const name = (document.getElementById('ptName')?.value || '').trim();
    if (!name) { showToast(false, t('profiles.theme.name_required', 'Please enter a theme name')); return; }
    sendToCS({
        action: 'vrcSaveProfileTheme',
        themeId: _ptEditId,
        name,
        buttonColor: _ptEditColors.button,
        iconColor: _ptEditColors.icon,
        subtextColor: _ptEditColors.subtext,
    });
    closeProfileThemeEditor();
}

function deleteProfileTheme(themeId) {
    sendToCS({ action: 'vrcDeleteProfileTheme', themeId });
}

function onProfileThemeSaved(data) {
    if (!data || !data.success || !data.theme) { showToast(false, t('profiles.theme.save_failed', 'Could not save theme')); return; }
    if (currentVrcUser) {
        if (!Array.isArray(currentVrcUser.themes)) currentVrcUser.themes = [];
        const i = currentVrcUser.themes.findIndex(x => x.id === data.theme.id);
        if (i >= 0) currentVrcUser.themes[i] = data.theme; else currentVrcUser.themes.push(data.theme);
        if (data.created) currentVrcUser.themeId = data.theme.id;
        _mypApplyActiveThemeColors();
    }
    showToast(true, t('profiles.deco.updated', 'Profile updated!'));
    renderProfileDecoPicker(false);
}

function onProfileThemeDeleted(data) {
    if (!data || !data.success) { showToast(false, t('profiles.theme.delete_failed', 'Could not delete theme')); return; }
    if (currentVrcUser && Array.isArray(currentVrcUser.themes)) {
        currentVrcUser.themes = currentVrcUser.themes.filter(x => x.id !== data.themeId);
        if (currentVrcUser.themeId === data.themeId) currentVrcUser.themeId = '';
        _mypApplyActiveThemeColors();
    }
    renderProfileDecoPicker(false);
}
