# Changelog

Todos los cambios relevantes de Journal #1 se anotan aquí.

El formato sigue [Keep a Changelog 1.1.0](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [Sin publicar]

La versión declarada en `package.json` es `1.0.0`. El repositorio no tiene tags.

### Añadido

- Libro a doble página en escritorio y navegación táctil en móvil.
- Carga automática de páginas Markdown desde `src/content/pages/`.
- Hojas arrancadas para los números de página ausentes.
- Linterna UV arrastrable para revelar la tinta invisible de los archivos `-invisible.md`.
- Comentarios HTML ocultos y revelados con luz roja.
- Soporte de tachado, subrayado, resaltado, listas, citas y bloques de código.
- Imágenes tipo polaroid, con alineación izquierda o derecha.
- Ajuste automático de la tipografía según el contenido.
- Portada ilustrada, página de propiedad y página de cierre.
- Vista en caliente con Vite.
- Analítica de Vercel.
- Demo publicada en [journal-1-mu.vercel.app](https://journal-1-mu.vercel.app/).
- Configuración de identidad del diario en `src/config.js`.
- Documentación de personalización, escritura de páginas y recursos.

### Cambiado

- El diario pasó a ser un solo tomo con identidad y portada propias.
- La portada PNG se reemplazó por una versión SVG.
- El favicon y los estilos de la linterna UV se ajustaron.
- Las páginas `final-before-wait` se ignoran en la navegación.
- Se eliminaron los metadatos de submódulo de la plantilla.

### Corregido

- La luz azul recorre todas las páginas y el gesto de página funciona en móvil.
- Las imágenes no se ocultan al ajustar su altura.
- Los títulos admiten estilos Markdown.
- Se estandarizó el uso de mayúsculas en textos y páginas.

[Sin publicar]: https://github.com/Saaarmyx/Journal-1/commits/main

<!-- TODO: añadir enlaces de comparación entre versiones cuando el repositorio tenga tags. -->
