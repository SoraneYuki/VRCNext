(function () {
    const INIT = '_slideNavbarReady';

    function sync(bar, animate) {
        const ind = bar._slideIndicator;
        if (!ind) return;
        const active = bar.querySelector('.vrcn-slide-tab.active');
        if (!active || !bar.clientWidth) { ind.style.opacity = '0'; return; }

        const barRect = bar.getBoundingClientRect();
        const tabRect = active.getBoundingClientRect();
        if (!tabRect.width) { ind.style.opacity = '0'; return; }

        if (!animate) ind.classList.add('no-anim');
        ind.style.width = tabRect.width + 'px';
        ind.style.transform = 'translateX(' + (tabRect.left - barRect.left + bar.scrollLeft) + 'px)';
        ind.style.opacity = '1';
        if (!animate) {
            void ind.offsetWidth;
            ind.classList.remove('no-anim');
        }
    }

    function init(bar) {
        if (bar[INIT]) return;
        bar[INIT] = true;

        const ind = document.createElement('span');
        ind.className = 'vrcn-slide-indicator no-anim';
        bar.insertBefore(ind, bar.firstChild);
        bar._slideIndicator = ind;
        bar.classList.add('has-indicator');

        const ro = window.ResizeObserver ? new ResizeObserver(() => sync(bar, false)) : null;
        const observeTabs = () => {
            if (!ro) return;
            bar.querySelectorAll('.vrcn-slide-tab').forEach(tab => ro.observe(tab));
        };
        if (ro) ro.observe(bar);
        observeTabs();

        new MutationObserver(records => {
            for (const r of records) {
                if (r.target === ind) continue;
                if (r.type === 'childList') observeTabs();
                sync(bar, true);
                return;
            }
        }).observe(bar, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['class'],
        });

        bar.addEventListener('scroll', () => sync(bar, false), { passive: true });
        sync(bar, false);
    }

    function scan() {
        document.querySelectorAll('.vrcn-slide-navbar').forEach(init);
    }

    let pending = false;
    function scheduleScan() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => { pending = false; scan(); });
    }

    function syncAll() {
        document.querySelectorAll('.vrcn-slide-navbar').forEach(bar => sync(bar, false));
    }

    function start() {
        scan();
        new MutationObserver(records => {
            for (const r of records) {
                if (r.addedNodes.length) { scheduleScan(); return; }
            }
        }).observe(document.body, { childList: true, subtree: true });
        document.documentElement.addEventListener('themechange', syncAll);
        window.addEventListener('resize', syncAll);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncAll);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();

    window.syncSlideNavbars = syncAll;
})();
