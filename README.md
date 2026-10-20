# Diario personal

Diario web a pantalla completa, organizado como un libro abierto. Cada hoja vive en un archivo Markdown independiente.

## Ejecutar

```bash
npm install
npm run dev
```

## Añadir páginas

Guarda cada página en `src/content/pages/` con solo su número: `01.md` o `001.md`. Vite detecta los archivos Markdown automáticamente y los ordena por ese número.

```md
---
title: El título de la página
date: 20 octubre 2026
---

Tu texto en Markdown.
```

El texto entre `~~` aparece tachado en la página:

```md
~~Esto aparecerá tachado.~~
```

La portada debe ser `000.md` (o `00.md`). La página `01.md` queda para “Propiedad de ???”. Si falta un número intermedio, la app muestra una hoja arrancada en su lugar. `lastPageNumber` en `src/config.js` define hasta qué número deben mostrarse hojas ausentes al final.

`final.md` define el cierre del diario. Su título y contenido aparecen centrados en una hoja con un tratamiento visual especial; no se aplica al resto de páginas.

## Imágenes tipo polaroid

Coloca las imágenes en `public/images/` y escribe la sintaxis Markdown en la página donde quieres que aparezca. El texto entre comillas será el pie de foto:

```md
![Descripción de la foto](/images/foto.jpg "Pie de foto")
```

Las páginas sin sintaxis de imagen no muestran fotos.

Para colocar una polaroid a un lado del texto, agrega `{left}` o `{right}` al final. El texto siguiente rodea la foto:

```md
![Descripción](/images/foto.jpg "Apunte visual") {right}
```

## Tinta invisible

Una nota adicional se guarda en otro archivo con el mismo número y el sufijo `-invisible.md`. El botón ✦ activa una luz azul: al mover el puntero o el dedo sobre la página, la luz revela el texto oculto sin salir de la hoja ni añadir otra página:

```text
02-invisible.md
```

Ese archivo usa el mismo formato Markdown y puede definir su propio `title` en el frontmatter.
Si existe el archivo invisible pero falta el Markdown normal con ese número, el diario muestra una hoja en blanco que conserva el botón de luz azul.
