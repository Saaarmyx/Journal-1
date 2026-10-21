# Journal Template

![Versión](https://img.shields.io/badge/version-1.0.0-8b5e3c)
![Licencia](https://img.shields.io/badge/license-Apache--2.0-8b5e3c)
![Estado](https://img.shields.io/badge/status-template-6b705c)

Una plantilla modular para crear diarios digitales personales a partir de archivos Markdown. Configura varios diarios y tomos, escribe cada página por separado y publica cada copia con la identidad y el contenido de su autor.

La demo enlazada es la edición personal de Saaarmyx. El código de la plantilla puede reutilizarse para crear diarios propios.

## Demostración

Explora el diario interactivo en la versión publicada:

[![Abrir la demostración en vivo](https://img.shields.io/badge/Abrir%20demostraci%C3%B3n-Diario%20interactivo-8b5e3c?style=for-the-badge)](https://journal-1-mu.vercel.app/)

## Características

- Libro a doble página en escritorio, con navegación táctil y deslizamiento en móviles.
- Varios diarios y tomos seleccionables desde la interfaz.
- Configuración por diario para autor, título, descripción, portada y tomos.
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
npm install
npm run dev
```

Abre la URL local que imprime Vite. Para generar y previsualizar la versión de producción:

```bash
npm run build
npm run preview
```

## Crear tu diario y añadir tomos

Edita `src/config.js` para configurar la identidad del diario y la lista de tomos. Cada diario tiene un `id`, nombre, autor, descripción, tomo inicial y uno o más tomos. El selector de diarios y tomos aparece automáticamente cuando agregas más de una opción.

La edición incluida usa `src/content/pages/` como contenido del tomo 01. Para añadir otro tomo o un diario independiente, crea un directorio dentro de `src/content/journals/` y registra su ruta en `src/config.js`:

```js
{
  id: 'mi-diario',
  title: 'Mi diario',
  author: 'Tu nombre',
  description: 'Notas, observaciones y memoria.',
  defaultVolumeId: '01',
  volumes: [
    {
      id: '01',
      title: 'Tomo 1',
      contentDirectory: 'journals/mi-diario/01',
      cover: '/journals/mi-diario/01/portada.jpg',
      coverAlt: 'Portada de Mi diario',
    },
    {
      id: '02',
      title: 'Tomo 2',
      contentDirectory: 'journals/mi-diario/02',
      cover: '/journals/mi-diario/02/portada.jpg',
      coverAlt: 'Portada del tomo 2',
    },
  ],
}
```

Guarda las páginas como `src/content/journals/mi-diario/01/000.md`, `001.md`, etc. Pon las imágenes de portada en `public/journals/mi-diario/01/` y referencia imágenes de página desde `public/` con rutas como `/journals/mi-diario/01/foto.jpg`. Para separar diarios de distintos autores, añade otra entrada al arreglo `journals` de `src/config.js` con su propio `id` y sus tomos.

La URL acepta `?journal=mi-diario&volume=02`; los selectores actualizan estos valores al cambiar de diario o tomo. Así cada tomo conserva su propia página de lectura.

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

- `000.md` representa la portada. La imagen de portada está en `public/portada.png`.
- `001.md` es la página de propiedad.
- `final.md` añade una única página de cierre al final del libro.

## Estructura del proyecto

```text
public/                    Recursos públicos, portada, imágenes y favicon
src/
  config.js                Autores, diarios, tomos y portadas
  content/
    pages/                 Páginas del tomo inicial de la demo
    journals/              Contenido separado por diario y tomo
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
