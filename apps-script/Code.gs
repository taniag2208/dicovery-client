/**
 * Apps Script para el formulario "Discovery Technofood".
 * Recibe cada envío (POST con JSON) y lo guarda en la hoja:
 *   - las PREGUNTAS quedan como columnas (fila 1)
 *   - cada ENVÍO queda como una fila nueva
 *   - se agrega siempre la columna "Fecha y hora"
 *
 * Escribe en la PRIMERA hoja del documento (p. ej. "Hoja 1"): no crea
 * pestañas nuevas y agrega columnas automáticamente si llegan campos nuevos.
 *
 * IMPORTANTE al actualizar el código:
 * Implementar → Gestionar implementaciones → editar (lápiz) →
 * Versión: "Nueva versión" → Implementar.
 * Así se conserva la MISMA URL /exec. Si creas una implementación nueva,
 * la URL cambia y hay que pegarla de nuevo en index.html (SHEET_WEBHOOK_URL).
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0]; // primera hoja (Hoja 1)

    var data = JSON.parse(e.postData.contents);
    data['Fecha y hora'] = Utilities.formatDate(
      new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    var lastCol = sheet.getLastColumn();
    var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

    // Si la fila 1 está vacía (solo celdas en blanco), la tratamos como sin encabezados
    if (headers.join('') === '') headers = [];

    // Agrega columnas nuevas para claves que aún no tienen encabezado
    var newKeys = Object.keys(data).filter(function (k) {
      return headers.indexOf(k) === -1;
    });
    if (newKeys.length > 0) {
      headers = headers.concat(newKeys);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    var row = headers.map(function (h) {
      return data[h] !== undefined ? data[h] : '';
    });
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', columnas: headers.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Verificación en el navegador: abre la URL /exec y debe mostrar este texto.
function doGet(e) {
  return ContentService
    .createTextOutput('El webhook de Discovery Technofood está activo.');
}
