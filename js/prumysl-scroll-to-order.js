/**
 * Scroll redirect CTAs to the main order form (not form submit buttons).
 */
(function () {
    var FORM_ID = 'main-order-form';
    var SECTION_ID = 'order';

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

    function isRedirectLink(el) {
        if (!el || el.tagName !== 'A') return false;
        var href = el.getAttribute('href');
        return href === '#order' || href === '#main-order-form';
    }

    document.addEventListener('click', function (e) {
        var link = e.target.closest('a.features-cta-btn, a[href="#order"], a[href="#main-order-form"]');
        if (!link || !getOrderTarget()) return;
        if (link.classList.contains('features-cta-btn') || isRedirectLink(link)) {
            e.preventDefault();
            scrollToOrderForm();
        }
    });

    var goBtn = document.getElementById('goToOrder');
    if (goBtn) {
        goBtn.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToOrderForm();
        });
    }

    window.prumyslScrollToOrderForm = scrollToOrderForm;
})();
