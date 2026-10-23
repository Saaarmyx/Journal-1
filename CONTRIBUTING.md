# Contribuir a Journal #1

Gracias por el interés. Journal #1 es un diario personal construido sobre una plantilla abierta: el motor se puede mejorar, pero el contenido no se toca.

## Antes de empezar

Abre un issue si quieres cambiar el comportamiento del libro, la carga de páginas o el renderizado de Markdown. Para corregir un detalle del motor, puedes enviar el Pull Request directamente.

**No envíes entradas, fotografías, portadas ni fragmentos del diario personal.** Este repositorio contiene contenido privado y no se aceptan cambios sobre él.

## Flujo de trabajo

1. Haz un fork del repositorio.
2. Crea una rama desde `main`:

   ```bash
   git checkout -b feat/mejorar-paginacion
   ```

   Usa prefijos `feat/`, `fix/` o `docs/` y nombres en kebab-case.

3. Haz commits atómicos con [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/):

   ```text
   feat(journal): añade una transición al pasar de página
   fix(markdown): corrige el renderizado de enlaces
   docs(readme): documenta el frontmatter
   ```

4. Abre un Pull Request contra `main` explicando qué cambia y cómo lo probaste.

## Entorno de desarrollo

```bash
git clone https://github.com/Saaarmyx/Journal-1.git
cd Journal-1
npm install
npm run dev
```

Comprobaciones antes de enviar:

```bash
npm run build
npm run preview
```

No hay linter ni suite de tests configurados. Si tu cambio afecta a `loadPages.js` o `markdown.js`, describe en el PR las páginas y casos que probaste a mano.

## Estándares de código

- **JavaScript moderno**, sin framework de interfaz.
- **Vite 6** para desarrollo y build.
- **Markdown** interpretado en el navegador por `src/journal/markdown.js`.
- **Contenido:** las páginas van en `src/content/pages/` y las imágenes en `public/images/`.
- **Formato:** respeta `.editorconfig` (UTF-8, LF, 4 espacios; 2 en JSON).
- **Tests:** no hay runner. El gate mínimo es que `npm run build` termine sin errores y que el libro siga navegable en escritorio y móvil.
- **Build:** no edites `dist/` a mano; se genera con `npm run build`.

## Checklist del Pull Request

- [ ] El cambio está explicado y no modifica el contenido personal.
- [ ] `npm run build` pasa.
- [ ] Probé el libro en escritorio y en móvil.
- [ ] No incluí entradas, fotos ni datos personales.
- [ ] Actualicé `README.md` y `CHANGELOG.md` si hace falta.
- [ ] El commit sigue Conventional Commits.

## Proceso de revisión

Reviso los PR cuando puedo, sin plazos fijos. Los cambios que afectan al renderizado del diario pueden tardar más porque necesito comprobar que no rompen páginas existentes.

## Acuerdo de contribución

No hay CLA. Al enviar una contribución de código aceptas que se incorpore al proyecto bajo **Apache License 2.0** (`Apache-2.0`).

El contenido personal de `src/content/` y los medios de `public/` no forman parte de la contribución y no se relicencian.

## Código de conducta

- Respeta a las demás personas y su privacidad.
- Crítica el código, no a quien lo escribió.
- No publiques entradas, fotos ni información personal del diario.
- No reportes vulnerabilidades en issues públicos.

## Licencia

Las contribuciones de código quedan bajo **Apache License 2.0** (`Apache-2.0`). Consulta [LICENSE](LICENSE) y [NOTICE](NOTICE).
