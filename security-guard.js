// ==================== SECURITY GUARD - REPO 1 (GUEST HUB + STAFF) ====================
// Protection adaptée pour les applications clients et staff
// Version optimisée : performance, idempotence, robustesse

(function () {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        enabled: true,
        logging: true,
        maskSensitiveData: true,
        appType: 'guest_hub_staff',
        protectedPages: ['staff-dashboard.html', 'index.html'],
        maxLogs: 200,
        logThrottleMs: 500,          // Anti-spam : 1 log max / 500ms / action
        maskDebounceMs: 300,          // Debounce du masquage
        warnDurationMs: 5000
    };

    // ==================== DÉTECTION DE PAGE ====================
    const currentPage = (window.location.pathname.split('/').pop() || 'index.html').split('?')[0];
    const isStaffPage = /^staff(-|_)?.*\.html$/i.test(currentPage) || currentPage.includes('staff-');
    const isGuestPage = !isStaffPage && (
        currentPage === '' ||
        /^index(\.html)?$/i.test(currentPage) ||
        currentPage.includes('guest')
    );

    // ==================== STOCKAGE SÉCURISÉ ====================
    const safeStorage = {
        get(key) {
            try { return localStorage.getItem(key); }
            catch (e) { return null; }
        },
        set(key, value) {
            try { localStorage.setItem(key, value); return true; }
            catch (e) { return false; }
        },
        getJSON(key, fallback = null) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : fallback;
            } catch (e) { return fallback; }
        }
    };

    // ==================== ANTI-SPAM DES LOGS ====================
    const logCache = new Map();

    function shouldLog(action) {
        const now = Date.now();
        const last = logCache.get(action) || 0;
        if (now - last < CONFIG.logThrottleMs) return false;
        logCache.set(action, now);
        return true;
    }

    // ==================== JOURNALISATION ====================
    function logActivity(action, details = {}) {
        if (!CONFIG.logging) return;
        if (!shouldLog(action)) return;

        try {
            const logEntry = {
                ts: new Date().toISOString(),
                repo: CONFIG.appType,
                page: currentPage,
                type: isStaffPage ? 'staff' : 'guest',
                action,
                details,
                role: safeStorage.get('userRole') || (isStaffPage ? 'staff_unknown' : 'guest'),
                room: safeStorage.get('roomNumber') || null
            };

            console.log('🔒 Security:', logEntry);

            const logs = safeStorage.getJSON('security_logs_repo1', []) || [];
            logs.push(logEntry);

            // Rotation par nombre ET par date (24h)
            const oneDayAgo = Date.now() - 86400000;
            const recent = logs.filter(l => {
                const t = new Date(l.ts).getTime();
                return !isNaN(t) && t > oneDayAgo;
            });

            const trimmed = recent.slice(-CONFIG.maxLogs);
            safeStorage.set('security_logs_repo1', JSON.stringify(trimmed));
        } catch (e) {
            // Silencieux
        }
    }

    // ==================== PROTECTION STAFF ====================
    function protectStaffPages() {
        if (!isStaffPage) return;

        const staffSession = (() => {
            try { return sessionStorage.getItem('staffSession'); }
            catch (e) { return null; }
        })();
        const staffRole = safeStorage.get('userRole');

        if (!staffSession && !staffRole) {
            console.log('🔒 Staff non authentifié - mode surveillance');
            logActivity('staff_unauthenticated_access');
            showDiscreetWarning('Mode surveillance - Staff non authentifié');
        } else {
            logActivity('staff_authenticated', { role: staffRole });
        }

        // Délégation d'événement unique (pas de listener par clic)
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-staff-action]');
            if (target) {
                logActivity('staff_action', {
                    action: target.getAttribute('data-staff-action'),
                    element: (target.textContent || '').trim().slice(0, 50)
                });
            }
        }, { passive: true });
    }

    // ==================== PROTECTION GUEST ====================
    function protectGuestPages() {
        if (!isGuestPage) return;

        const roomNumber = safeStorage.get('roomNumber');
        const guestName = safeStorage.get('guestName');

        if (roomNumber && guestName) {
            logActivity('guest_session_active', {
                room: roomNumber,
                name: guestName
            });
        }

        maskGuestData();
    }

    // ==================== MASQUAGE DES DONNÉES ====================
    function maskString(value, type) {
        if (!value || typeof value !== 'string') return value;
        const v = value.trim();
        if (!v) return value;

        switch (type) {
            case 'fullname': {
                const parts = v.split(/\s+/);
                if (parts.length > 1 && parts[1].length > 0) {
                    return parts[0] + ' ' + parts[1].charAt(0) + '.';
                }
                return v;
            }
            case 'email': {
                if (!v.includes('@')) return v;
                const [local, domain] = v.split('@');
                if (local.length > 2) {
                    return local.slice(0, 2) + '***@' + domain;
                }
                return v;
            }
            case 'phone': {
                if (v.length <= 6) return v;
                const last4 = v.slice(-4);
                const masked = v.slice(0, -4).replace(/\d/g, '*');
                return masked + last4;
            }
            default:
                return v;
        }
    }

    function maskElement(el, type) {
        // Empêcher le re-masquage (idempotence)
        if (!el || el.dataset.masked === 'true') return;

        const original = el.textContent;
        const masked = maskString(original, type);

        if (masked !== original) {
            el.textContent = masked;
        }
        el.dataset.masked = 'true';
    }

    function maskGuestData() {
        if (!CONFIG.maskSensitiveData) return;

        const selectors = [
            { sel: '[data-mask="fullname"]', type: 'fullname' },
            { sel: '[data-mask="email"]', type: 'email' },
            { sel: '[data-mask="phone"]', type: 'phone' }
        ];

        selectors.forEach(({ sel, type }) => {
            document.querySelectorAll(sel).forEach(el => maskElement(el, type));
        });
    }

    // Debounce du masquage pour éviter les appels excessifs
    let maskTimer = null;
    function scheduleMask() {
        if (maskTimer) return;
        maskTimer = setTimeout(() => {
            maskTimer = null;
            maskGuestData();
        }, CONFIG.maskDebounceMs);
    }

    // ==================== AVERTISSEMENT DISCRET ====================
    function showDiscreetWarning(message) {
        if (document.getElementById('security-guard-warning')) return;

        const warning = document.createElement('div');
        warning.id = 'security-guard-warning';
        warning.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            color: #DCA773;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 10px;
            z-index: 9999;
            border: 1px solid #DCA773;
            pointer-events: none;
            max-width: 260px;
        `;
        warning.textContent = '🔒 ' + message;

        if (document.body) {
            document.body.appendChild(warning);
            setTimeout(() => warning.remove(), CONFIG.warnDurationMs);
        }
    }

    // ==================== VALIDATION DES ENTRÉES ====================
    const SANITIZE_REGEX = /[<>'"]/g;

    function setupInputValidation() {
        document.addEventListener('input', (e) => {
            const target = e.target;
            if (!target || !target.id) return;

            // Champs de chambre
            if (target.id === 'lockRoomInput' || target.id === 'guestRoomInput') {
                const cleaned = target.value.replace(SANITIZE_REGEX, '').slice(0, 10);
                if (cleaned !== target.value) target.value = cleaned;
            }

            // Champs de nom
            if (target.id === 'lockNameInput' || target.id === 'guestNameInput') {
                const cleaned = target.value.replace(SANITIZE_REGEX, '').slice(0, 50);
                if (cleaned !== target.value) target.value = cleaned;
            }
        }, { passive: true });
    }

    // ==================== INITIALISATION ====================
    function init() {
        if (!CONFIG.enabled) return;

        logActivity('app_loaded');

        const onReady = () => {
            protectStaffPages();
            protectGuestPages();
            maskGuestData();
            setupInputValidation();
            logActivity('dom_ready');

            // Observer optimisé : ne masque que les nouveaux noeuds
            if (CONFIG.maskSensitiveData && typeof MutationObserver !== 'undefined') {
                const observer = new MutationObserver((mutations) => {
                    let needsMask = false;

                    for (const m of mutations) {
                        for (const node of m.addedNodes) {
                            if (node.nodeType !== 1) continue; // élément uniquement
                            if (
                                node.matches?.('[data-mask]') ||
                                node.querySelector?.('[data-mask]')
                            ) {
                                needsMask = true;
                                break;
                            }
                        }
                        if (needsMask) break;
                    }

                    if (needsMask) scheduleMask();
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onReady, { once: true });
        } else {
            onReady();
        }
    }

    init();

    // ==================== API PUBLIQUE ====================
    window.securityGuard = {
        log: logActivity,
        mask: maskGuestData,
        maskString,
        config: CONFIG,
        isStaffPage,
        isGuestPage
    };

})();
