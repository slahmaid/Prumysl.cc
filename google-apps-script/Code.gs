/**
 * Prumysl — Orders → Google Sheet
 *
 * SETUP (one time):
 * 1. Create a Google Sheet (e.g. "Prumysl Orders").
 * 2. Extensions → Apps Script → paste this file → Save.
 * 3. Run once: setupOrdersSheet (authorize when prompted).
 * 4. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone.
 * 5. Copy the Web app URL into js/prumysl-orders.js (PRUMYSL_ORDERS_SCRIPT_URL)
 *    and redeploy your website.
 */

var ORDERS_SHEET_NAME = 'Orders';
var HEADERS = ['Date', 'Name', 'City', 'Phone', 'Model', 'Quantity', 'Price'];

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var sheet = getOrdersSheet_();
    var qty = parseInt(p.quantity, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    var price = parseFloat(String(p.price || '').replace(',', '.'));
    if (isNaN(price)) price = '';

    sheet.appendRow([
      new Date(),
      String(p.name || '').trim(),
      String(p.city || '').trim(),
      String(p.phone || '').trim(),
      String(p.model || p.product_offer || '').trim(),
      qty,
      price
    ]);

    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return jsonOut_({ ok: true, message: 'Prumysl orders endpoint. Use POST from order forms.' });
}

/** Run manually from the editor to create the Orders tab and headers. */
function setupOrdersSheet() {
  getOrdersSheet_(true);
}

function getOrdersSheet_(forceReset) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(ORDERS_SHEET_NAME);

  if (forceReset && sheet) {
    ss.deleteSheet(sheet);
    sheet = null;
  }

  if (!sheet) {
    sheet = ss.insertSheet(ORDERS_SHEET_NAME);
    sheet.appendRow(HEADERS);
    var header = sheet.getRange(1, 1, 1, HEADERS.length);
    header.setFontWeight('bold');
    header.setBackground('#202895');
    header.setFontColor('#ffffff');
    header.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, HEADERS.length);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
