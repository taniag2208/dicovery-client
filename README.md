# Discovery Technofood

Formulario de discovery para el proyecto Technofood. Guarda cada envío como una fila nueva en Google Sheets vía un webhook de Google Apps Script.

## Contenido

- `index.html` — el formulario. Sitio estático, sin build, listo para desplegar en Vercel.
- `apps-script/Code.gs` — script para pegar en el editor de Apps Script de tu Google Sheet; recibe el POST del formulario y escribe la fila.

## Configuración (Google Sheets)

1. Abre (o crea) la Google Sheet donde quieres guardar las respuestas.
2. Menú **Extensiones → Apps Script**.
3. Borra el código de ejemplo y pega el contenido de `apps-script/Code.gs`.
4. Guarda el proyecto.
5. **Implementar → Nueva implementación** → tipo "Aplicación web".
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
6. Autoriza los permisos (Google mostrará una advertencia de "app no verificada" — Avanzado → Ir al proyecto).
7. Copia la URL que termina en `/exec` y ábrela una vez en el navegador para confirmar que responde "El webhook de Discovery Technofood está activo."
8. En `index.html`, reemplaza el valor de `SHEET_WEBHOOK_URL` (dentro del `<script>`) con esa URL.

## Despliegue en Vercel

Este repo no necesita build: es HTML/CSS/JS puro con `index.html` en la raíz. En Vercel:

1. **New Project** → importa este repositorio de GitHub.
2. Framework Preset: **Other** (o déjalo en detección automática).
3. Deploy — no requiere variables de entorno ni comandos de build.

Cada push a `main` genera un despliegue nuevo automáticamente.
