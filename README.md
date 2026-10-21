# Journal 1

![Versión](https://img.shields.io/badge/version-1.0.0-8b5e3c)
![Licencia](https://img.shields.io/badge/licencia-uso%20personal%20no%20comercial-8b5e3c)
![Estado](https://img.shields.io/badge/estado-proyecto%20personal-6b705c)

Un diario digital que convierte archivos Markdown en un libro interactivo. Cada página se escribe y mantiene por separado, así que puedes añadir, editar o quitar contenido sin modificar los componentes de la aplicación.

Esta edición reúne apuntes personales de matemáticas: desde aritmética y álgebra hasta cálculo, estadística y métodos numéricos.

## Demostración

Accediendo a este enlace: [Vista previa](https://journal-1-mu.vercel.app)

## Características

- Libro a doble página en escritorio, con navegación táctil y deslizamiento en móviles.
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

Abre la URL que imprime Vite. Para generar y previsualizar la versión de producción:

```bash
npm run build
npm run preview
```

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

La nota aparece sobre la misma página, no en una ventana aparte. En escritorio la luz sigue el puntero; en móvil se activa directamente con el botón.

### Portada y cierre

- `000.md` representa la portada. La imagen de portada está en `public/portada.png`.
- `001.md` es la página de propiedad.
- `final.md` añade una única página de cierre al final del libro.

## Estructura del proyecto

```text
public/                    Recursos públicos, portada, imágenes y favicon
src/
  content/pages/           Páginas numeradas en Markdown
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

Es un proyecto personal. Si quieres proponer una mejora, abre un _issue_ o un _pull request_ con una descripción del cambio. No envíes información privada en los reportes. Las contribuciones solo se integrarán con autorización de sus autores para distribuirlas bajo las condiciones de este proyecto.

## Créditos y licencia

Creado por **Saaarmyx**. La licencia personalizada permite usar, copiar y modificar el proyecto para fines personales y no comerciales, exige atribución y prohíbe venderlo. Lee [LICENSE](LICENSE) antes de reutilizarlo.

Esta condición permite consultar el código y reutilizarlo bajo esos límites, pero no es una licencia de código abierto según la definición de OSI, que no permite restringir el uso comercial. Los paquetes y recursos de terceros conservan sus propias licencias.
