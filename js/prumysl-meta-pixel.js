/**
 * Prumysl Meta Pixel — InitiateCheckout (order forms), Purchase (thank-you), contact strip.
 */
(function (global) {
  var PRODUCTS_BY_PAGE = {
    'moka-page': { contentId: 'MOKA-4G-DUAL', unitPrice: 599 },
    'moka-pro-max-page': { contentId: 'MOKA-PRO-MAX', unitPrice: 699 },
    'assas-page': { contentId: 'ASSAS-4G-3L', unitPrice: 889 },
    'garde-corps-page': { contentId: 'GCORPS-4G-3PTZ', unitPrice: 1199 },
    'saqr-page': { contentId: 'SAQR-4G-36X', unitPrice: 1899 }
  };

  var MODEL_TO_CONTENT = {
    'كاميرا موكا الذكية': 'MOKA-4G-DUAL',
    'كاميرا موكا برو ماكس': 'MOKA-PRO-MAX',
    'كاميرا العساس': 'ASSAS-4G-3L',
    'كاميرا غارد كور': 'GCORPS-4G-3PTZ',
    'كاميرا الصقر': 'SAQR-4G-36X'
  };

  function getProductFromBody() {
    var body = document.body;
    if (!body || !body.classList) return null;
    var keys = Object.keys(PRODUCTS_BY_PAGE);
    for (var i = 0; i < keys.length; i++) {
      if (body.classList.contains(keys[i])) return PRODUCTS_BY_PAGE[keys[i]];
    }
    return null;
  }

  function trackInitiateCheckout(product) {
    if (typeof fbq === 'undefined' || !product) return;
    fbq('track', 'InitiateCheckout', {
      content_type: 'product',
      content_ids: [product.contentId],
      currency: 'MAD',
      value: product.unitPrice,
      num_items: 1
    });
  }

  function bindInitiateCheckoutOnForms() {
    var product = getProductFromBody();
    if (!product) return;
    document.querySelectorAll('form.order-form').forEach(function (form) {
      form.addEventListener('focusin', function (e) {
        var t = e.target;
        if (!t || t.tagName !== 'INPUT') return;
        var field = t.getAttribute('name');
        if (field !== 'name' && field !== 'city' && field !== 'phone') return;
        if (form.dataset.checkoutIntentTracked === '1') return;
        form.dataset.checkoutIntentTracked = '1';
        trackInitiateCheckout(product);
      });
    });
  }

  function bindContactStrip() {
    var row = document.querySelector('.contact-quick-row');
    if (!row) return;
    row.querySelectorAll('a.contact-quick-btn').forEach(function (link) {
      link.addEventListener('click', function () {
        var channel = link.classList.contains('contact-quick-btn--call') ? 'phone' : 'whatsapp';
        if (typeof fbq !== 'undefined') {
          fbq('trackCustom', 'QuickContactStripClick', {
            content_category: channel,
            content_name: 'header_to_hero_strip'
          });
        }
      });
    });
  }

  function contentIdFromModel(model) {
    return MODEL_TO_CONTENT[String(model || '').trim()] || '';
  }

  function trackPurchase(opts) {
    if (typeof fbq === 'undefined') return;
    var value = parseFloat(opts.value);
    if (isNaN(value)) value = 0;
    var qty = parseInt(opts.quantity, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    var payload = {
      content_type: 'product',
      currency: 'MAD',
      value: value,
      num_items: qty
    };
    if (opts.contentId) payload.content_ids = [opts.contentId];
    fbq('track', 'Purchase', payload);
  }

  function trackPurchaseFromUrl() {
    try {
      if (sessionStorage.getItem('prumysl_meta_purchase') === '1') return;
    } catch (e) { /* ignore */ }

    var params = new URLSearchParams(window.location.search);
    var contentId = String(params.get('content_id') || '').trim();
    var model = String(params.get('model') || '').trim();
    var priceRaw = params.get('price');
    var quantity = params.get('quantity') || '1';

    if (!contentId && model) contentId = contentIdFromModel(model);

    var value = parseFloat(String(priceRaw || '').replace(',', '.'));
    if (!contentId || isNaN(value) || value <= 0) return;

    trackPurchase({ contentId: contentId, value: value, quantity: quantity });

    try {
      sessionStorage.setItem('prumysl_meta_purchase', '1');
    } catch (e) { /* ignore */ }
  }

  function initProductPage() {
    bindContactStrip();
    bindInitiateCheckoutOnForms();
  }

  function initLandingPage() {
    bindContactStrip();
  }

  function initThankYouPage() {
    trackPurchaseFromUrl();
  }

  global.prumyslMetaPixelInitProductPage = initProductPage;
  global.prumyslMetaPixelInitLandingPage = initLandingPage;
  global.prumyslMetaPixelInitThankYouPage = initThankYouPage;
  global.prumyslMetaGetProductConfig = getProductFromBody;
})(window);
