<div align="center">

# Journal #1

Mi diario digital personal, con libro a doble página, tinta invisible y fotos tipo polaroid.

[![Licencia](https://img.shields.io/badge/Licencia-Apache_2.0-D22128?logo=apache&logoColor=white)](LICENSE)
![Estado](https://img.shields.io/badge/Estado-Estable-22C55E)
![Versión](https://img.shields.io/badge/Versión-1.0.0-8B5CF6)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)

</div>

## Estado del proyecto

**Estable.** El diario está publicado, tiene contenido propio y se mantiene con entradas nuevas. No tiene tests ni integración continua.

## Descripción

Journal #1 es mi diario personal: un solo tomo, una sola portada y páginas que se escriben en Markdown. La demo publicada es mi edición; el motor se puede reutilizar para crear otros diarios.

Lo hice para tener un espacio que no se sintiera como una lista de notas. El libro se pasa con gestos, las hojas faltantes quedan arrancadas y algunas notas solo aparecen cuando arrastras la linterna UV o la luz roja sobre la página.

## Características principales

- Libro a doble página en escritorio y navegación táctil en móvil.
- Un diario y un tomo por repositorio, con identidad y portada configurables.
- Portada, página de propiedad y cierre definidos en Markdown.
- Páginas numeradas que aparecen automáticamente al añadir archivos.
- Hojas arrancadas para los números ausentes.
- Notas de tinta invisible en archivos `-invisible.md`, reveladas con luz UV.
- Comentarios HTML ocultos que se revelan con luz roja.
- Tachado con `~~texto~~`, subrayado con `++texto++` y resaltado con `==texto==`.
- Fotografías tipo polaroid, centradas o junto al texto.
- Ajuste automático de la tipografía según el contenido.
- Vista en caliente durante el desarrollo.
- Analítica de Vercel.

## Requisitos

- Node.js 18, 20 o 22+.
- npm.

## Instalación

```bash
git clone https://github.com/Saaarmyx/Journal-1.git
cd Journal-1
npm install
```

## Uso

```bash
npm run dev      # desarrollo con recarga en caliente
npm run build    # build de producción en dist/
npm run preview  # previsualiza el build
```

Demo publicada: [https://journal-1-mu.vercel.app/](https://journal-1-mu.vercel.app/)

### Escribir una página

Las páginas viven en `src/content/pages/` y usan numeración consecutiva:

```text
src/content/pages/009.md
src/content/pages/009-invisible.md
```

Cada página puede incluir título y fecha:

```md
---
title: Una idea que quiero recordar
date: 21 de octubre de 2026
---

Escribe aquí el contenido de la página.
```

Procura mantener cada archivo en un máximo de 60 líneas. El diario ajusta el tamaño de letra, pero las líneas largas, las imágenes y las listas ocupan más espacio visual.

### Imágenes y polaroids

Guarda las imágenes en `public/images/` y referéncialas desde Markdown:

```md
![Descripción de la imagen](/images/foto.jpg 'Nota al pie')
```

Para alinear la polaroid a un lado:

```md
![Un apunte visual](/images/foto.jpg 'Mirar este detalle') {right}
```

### Configuración

Edita `src/config.js`:

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

## Estructura del proyecto

```text
Journal 1/
├── public/
│   ├── images/             # Fotografías del diario
│   ├── portada.svg         # Portada
│   └── favicon.svg
├── src/
│   ├── config.js           # Identidad y configuración del diario
│   ├── content/pages/      # Páginas Markdown del tomo
│   ├── journal/
│   │   ├── components/     # Book y Page
│   │   ├── createJournal.js
│   │   ├── loadPages.js
│   │   └── markdown.js
│   ├── main.js             # Entrada de la aplicación
│   └── styles/global.css
├── dist/                   # Build generado (no editar a mano)
├── index.html
├── vite.config.js
├── NOTICE
├── LICENSE
└── README.md
```

## Hoja de ruta

- [x] Libro a doble página con navegación táctil.
- [x] Carga automática de páginas Markdown.
- [x] Tinta invisible con linterna UV y luz roja para comentarios.
- [x] Polaroids, código y ajuste tipográfico.
- [x] Página de cierre y contenido del tomo.
- [x] Demo publicada en Vercel y analítica.
- [ ] Añadir pruebas para `loadPages` y el renderizado de Markdown.
- [ ] Configurar integración continua con `npm run build`.
- [ ] Publicar una versión etiquetada.
- [ ] Añadir un `vercel.json` si el despliegue necesita configuración explícita.

## Contribuir

El código del diario es abierto, pero el contenido de `src/content/` es personal. Si quieres mejorar el motor, lee [CONTRIBUTING.md](CONTRIBUTING.md). No envíes entradas, fotos ni correcciones de texto del diario.

## Seguridad

Si encuentras un fallo que exponga contenido personal o permita inyectar HTML en las páginas, sigue [SECURITY.md](SECURITY.md) y no lo publiques en un issue con datos del diario.

## Licencia

Este proyecto se distribuye bajo **Apache License 2.0** (`Apache-2.0`). Consulta el archivo [LICENSE](LICENSE) y el [NOTICE](NOTICE).

Apache 2.0 permite usar, modificar y redistribuir el código, con o sin fines comerciales, siempre que se conserve el aviso de copyright, se incluya una copia de la licencia y se indiquen los cambios. También incluye una concesión de patentes y requiere conservar los avisos de atribución.

**Importante:** la licencia cubre el código de la aplicación, no las entradas personales de `src/content/` ni las fotografías, portadas y demás medios de `public/`. Esos contenidos conservan los derechos de sus autores.

Es un proyecto personal de Santiago Sarmiento. No está afiliado a Nexora ni utiliza su marca.

---

Hecho por Santiago Sarmiento
