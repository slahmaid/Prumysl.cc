/**
 * Scroll redirect CTAs to the main order form (not form submit buttons).
 * Works with GitHub Pages <base> (site-base-head.js) by avoiding bare #hash navigation.
 */
(function () {
    var FORM_ID = 'main-order-form';
    var SECTION_ID = 'order';
    var SCROLL_SELECTOR = '[data-scroll-to-order], .features-cta-btn, a[href="#order"], a[href="#main-order-form"]';

    function getOrderTarget() {
        return document.getElementById(FORM_ID) || document.getElementById(SECTION_ID);
    }

    function scrollPaddingTop() {
        var v = parseInt(getComputedStyle(document.documentElement).scrollPaddingTop, 10);
        return isNaN(v) ? 80 : v;
    }

    function scrollToOrderForm() {
        var target = getOrderTarget();
        if (!target) return;
        var top = target.getBoundingClientRect().top + window.scrollY - scrollPaddingTop();
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        window.setTimeout(function () {
            var focusable = target.querySelector('input[name="name"], input[name="phone"], input, textarea, select');
            if (focusable) focusable.focus({ preventScroll: true });
        }, 450);
    }

    /** Bare #hash links resolve to site root when <base href="/Project/"> is set. */
    function fixHashLinksForBase() {
        var path = location.pathname + location.search;
        document.querySelectorAll('a[href="#order"], a[href="#main-order-form"]').forEach(function (el) {
            el.setAttribute('href', path + el.getAttribute('href'));
        });
    }

    function isScrollTrigger(el) {
        if (!el) return false;
        if (el.hasAttribute('data-scroll-to-order')) return true;
        if (el.classList.contains('features-cta-btn')) return true;
        if (el.tagName === 'A') {
            var href = el.getAttribute('href') || '';
            return href === '#order' || href === '#main-order-form' ||
                href.indexOf('#order') === href.length - 6 ||
                href.indexOf('#main-order-form') === href.length - 16;
        }
        return false;
    }

    function onScrollClick(e) {
        var trigger = e.target.closest(SCROLL_SELECTOR);
        if (!trigger || !isScrollTrigger(trigger)) return;
        e.preventDefault();
        scrollToOrderForm();
    }

    function init() {
        fixHashLinksForBase();
        document.addEventListener('click', onScrollClick);

        var goBtn = document.getElementById('goToOrder');
        if (goBtn) {
            goBtn.addEventListener('click', function (e) {
                e.preventDefault();
                scrollToOrderForm();
            });
        }
    }

    window.prumyslScrollToOrderForm = scrollToOrderForm;
    window.prumyslFixOrderHashLinks = fixHashLinksForBase;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
