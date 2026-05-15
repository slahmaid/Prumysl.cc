/**
 * Shared order payload for all Prumysl landing-page forms.
 */
window.PRUMYSL_ORDERS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzhNDLVnERzS3mfsS4x4XMNXfmAodPTb3muBCOhL4C1BiHnohcQnbTzODoYpVqid3Ir/exec';

/**
 * @param {FormData} formData
 * @param {{ model: string, unitPrice: number, contentId: string }} config
 * @returns {{ quantity: number, price: number, model: string, contentId: string }}
 */
function prumyslAppendOrderFields(formData, config) {
  const quantity = 1;
  const price = config.unitPrice;

  formData.set('model', config.model);
  formData.set('quantity', String(quantity));
  formData.set('price', String(price));
  if (config.contentId) formData.set('content_id', config.contentId);

  return { quantity, price, model: config.model, contentId: config.contentId || '' };
}

/**
 * Build thank-you URL with order summary query params.
 * @param {FormData} formData
 */
function prumyslThankYouUrl(formData) {
  const q = new URLSearchParams();
  const fields = ['name', 'city', 'phone', 'model', 'quantity', 'price', 'content_id'];
  fields.forEach((key) => {
    const val = formData.get(key);
    if (val != null && String(val).trim() !== '') q.set(key, String(val).trim());
  });
  const qs = q.toString();
  return qs ? '/thank-you/?' + qs : '/thank-you/';
}

function prumyslOrdersScriptUrl() {
  return window.PRUMYSL_ORDERS_SCRIPT_URL || '';
}
