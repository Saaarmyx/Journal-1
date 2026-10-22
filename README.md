# Journal Template

![Versión](https://img.shields.io/badge/version-1.0.0-8b5e3c)
![Licencia](https://img.shields.io/badge/license-Apache--2.0-8b5e3c)
![Estado](https://img.shields.io/badge/status-template-6b705c)

Un diario digital personal creado con la plantilla modular `journal-template`. Cada repositorio contiene un solo diario y un solo tomo. Las páginas se escriben en Markdown y se agregan automáticamente al libro.

La demo enlazada es la edición personal de Saaarmyx. El código de la plantilla puede reutilizarse para crear diarios propios.

## Demostración

Explora el diario interactivo en la versión publicada:

[![Abrir la demostración en vivo](https://img.shields.io/badge/Abrir%20demostraci%C3%B3n-Diario%20interactivo-8b5e3c?style=for-the-badge)](https://journal-1-mu.vercel.app/)

## Características

- Libro a doble página en escritorio, con navegación táctil y deslizamiento en móviles.
- Un diario y un tomo por repositorio, con identidad y portada configurables.
- Portada, página de propiedad y cierre definidos mediante Markdown.
- Páginas numeradas que aparecen automáticamente al añadir archivos; los números ausentes entre páginas escritas se muestran como hojas arrancadas.
- Notas de tinta invisible en archivos `-invisible.md`, reveladas con la luz azul sobre la misma hoja.
- Comentarios HTML que se ocultan del texto y se revelan con la luz roja; `~~texto~~` se muestra tachado.
- Fotografías tipo polaroid, centradas o junto al texto.
- Ajuste automático de la tipografía para aprovechar el espacio de la página y reducirla cuando el contenido crece.
- Vista en caliente durante el desarrollo cuando guardas cambios en Markdown.
- Analítica de Vercel.

## Tecnologías

- JavaScript moderno, HTML y CSS; no usa un framework de interfaz.
- Vite 6 para desarrollo y compilación.
- Markdown interpretado por el proyecto en el navegador.
- [Vercel Analytics](https://vercel.com/docs/analytics) para analítica.
- Tipografía Indie Flower, servida por Google Fonts.

## Requisitos

- Node.js 18, 20 o 22+.
- npm.

## Instalación y uso

```bash
git clone https://github.com/Saaarmyx/Journal-1.git
cd Journal-1
git submodule update --init --recursive
npm install
npm run dev
```

Abre la URL local que imprime Vite. Para generar y previsualizar la versión de producción:

```bash
npm run build
npm run preview
```

## Configurar el diario

Este repositorio mantiene un solo diario y un solo tomo. Edita `src/config.js` para personalizar su identidad, la ruta de contenido y la portada:

```js
export const journalConfig = {
  id: 'saaarmyx',
  title: 'Journal #1',
  author: 'Saaarmyx',
  description: 'Un diario personal, página a página.',
  contentDirectory: 'pages',
  cover: '/portada.svg',
  coverAlt: 'Portada ilustrada del diario',
  storageKey: 'journal-current-page',
}
```

Las páginas de esta edición permanecen en `src/content/pages/`. Para crear otro diario, crea otra copia desde el repositorio `journal-template`; este repositorio conserva un solo diario y un solo tomo.

## Escribir páginas

Guarda los archivos en `src/content/pages/`. Usa números consecutivos con ceros opcionales al inicio: `000.md`, `001.md`, `002.md`. El número identifica la posición de la hoja; la secuencia se extiende hasta el número más alto que tenga un archivo normal o invisible.

Si falta un número entre dos páginas existentes, el diario muestra una hoja arrancada en ese lugar. No inventa hojas después de la última página escrita. Si solo existe una página invisible para un número, muestra una hoja en blanco con el acceso a la luz azul.

Una página puede definir título y fecha en el _frontmatter_:

```md
---
title: Una idea que quiero recordar
date: 21 de octubre de 2026
---

Escribe aquí el contenido de la página.
```

El Markdown admite títulos de nivel 1 a 3, párrafos, citas, listas, código, enlaces e imágenes. Para dar formato al texto puedes usar negrita (`**texto**`), cursiva (`*texto*`), ambas (`***texto***`), tachado (`~~texto~~`), subrayado (`++texto++`), resaltado (`==texto==`) y código en línea (`` `código` ``):

```md
**Importante**, *una nota*, ***ambos estilos***, ~~tachado~~, ++subrayado++, ==resaltado== y `x + 1`.
```

Los comentarios HTML se ocultan del texto y pueden revelarse con la luz roja:

```md
<!-- revisar este paso después -->
```

Procura mantener cada archivo en un máximo de 60 líneas para que la página tenga espacio suficiente. El diario ajusta automáticamente el tamaño de letra según el contenido, pero líneas largas, imágenes y listas ocupan más espacio visual.

### Imágenes tipo polaroid

Guarda las imágenes en `public/images/` y haz referencia a ellas desde Markdown. El texto entre comillas se usa como pie de foto:

```md
![Descripción de la imagen](/images/foto.jpg 'Nota al pie')
```

Para alinear la polaroid a un lado y dejar que el texto la rodee, añade `{left}` o `{right}`:

```md
![Un apunte visual](/images/foto.jpg 'Mirar este detalle') {right}
```

### Tinta invisible

Añade `-invisible` al nombre de una página para guardar una explicación adicional. Por ejemplo, `001-invisible.md` acompaña a `001.md`:

```md
---
title: Una explicación extra
---

Este texto se revela con la luz azul.
```

La nota aparece sobre la misma página, no en una ventana aparte. Arrastra la linterna UV por la página para revelar la tinta; el gesto funciona con ratón y con el dedo.

### Portada y cierre

- `000.md` representa la portada. La imagen de portada se configura en `src/config.js` y está en `public/`.
- `001.md` es la página de propiedad.
- `final.md` añade una única página de cierre al final del libro.

## Estructura del proyecto

```text
public/                    Recursos públicos, portada, imágenes y favicon
src/
  config.js                Identidad, contenido y portada del diario
  content/
    pages/                 Páginas numeradas del único tomo
  journal/
    components/            Libro y hojas
    createJournal.js       Montaje del diario
    loadPages.js           Mapeo y orden de páginas
    markdown.js            Lectura y representación de Markdown
  styles/global.css        Estilos del libro y diseño adaptable
  main.js                  Entrada de la aplicación
vite.config.js             Configuración de Vite
```

## Contribuciones

Para proponer una mejora, abre un _issue_ o un _pull request_ con una descripción clara. No incluyas información privada ni contenido de diarios personales en los reportes. Las contribuciones de código se distribuyen bajo Apache-2.0.

## Créditos y licencia

Creado por **Saaarmyx**. El código de la plantilla se distribuye bajo la licencia estándar [Apache-2.0](LICENSE), aprobada por la [Open Source Initiative](https://opensource.org/licenses). Permite usar, modificar y redistribuir el código, incluso con fines comerciales, respetando sus condiciones de atribución y redistribución.

La licencia no cubre las entradas personales de `src/content/` ni fotografías, portadas y otros medios de `public/`; sus autores conservan sus derechos. Consulta [NOTICE](NOTICE) y las licencias individuales de dependencias y recursos de terceros antes de reutilizarlos.
