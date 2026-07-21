/**
 * Apps Script para recibir las respuestas del formulario "Discovery Technofood"
 * y guardarlas como una fila nueva en esta hoja de cálculo.
 *
 * Instalación:
 * 1. Abre (o crea) la Google Sheet donde quieres guardar las respuestas.
 * 2. Menú Extensiones → Apps Script.
 * 3. Borra el contenido de "Código.gs" y pega todo este archivo.
 * 4. Guarda el proyecto (Ctrl/Cmd + S).
 * 5. Implementar → Nueva implementación → tipo "Aplicación web".
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quién tiene acceso: Cualquier usuario
 * 6. Autoriza los permisos que pida Google (es tu propio script).
 * 7. Copia la URL que termina en "/exec" y pégala en index.html,
 *    en la constante SHEET_WEBHOOK_URL.
 *
 * Cada envío del formulario crea/actualiza la hoja "Respuestas":
 * agrega columnas nuevas automáticamente si aparecen campos nuevos,
 * y siempre añade una columna "Fecha y hora" con el momento del envío.
 */

const SHEET_NAME = 'Respuestas';

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    const data = JSON.parse(e.postData.contents);
    data['Fecha y hora'] = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    const lastCol = sheet.getLastColumn();
    let headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

    // Si llegan campos que todavía no tienen columna, se agregan al final
    const newKeys = Object.keys(data).filter(function (k) {
      return headers.indexOf(k) === -1;
    });
    if (newKeys.length > 0) {
      headers = headers.concat(newKeys);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    const row = headers.map(function (h) {
      return data[h] !== undefined ? data[h] : '';
    });
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Solo para verificar que la implementación quedó activa (abre la URL /exec en el navegador)
function doGet(e) {
  return ContentService
    .createTextOutput('El webhook de Discovery Technofood está activo.')
    .setMimeType(ContentService.MimeType.TEXT);
}
