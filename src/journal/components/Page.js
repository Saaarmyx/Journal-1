const escapeText = (text = '') =>
  text.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  )

export function createPage(page, side, nextPage = null) {
  const article = document.createElement('article')
  article.className = `page page--${page.kind} page--${side}`
  article.setAttribute(
    'aria-label',
    page.kind === 'missing'
      ? `Hoja arrancada ${page.number}`
      : `${page.title}, página ${page.number}`,
  )

  if (page.kind === 'missing') {
    if (!nextPage) article.classList.add('page--missing-end')
    article.innerHTML = `
      ${nextPage ? `<div class="under-sheet" aria-hidden="true">${createPage(nextPage, side).innerHTML}</div>` : ''}
      <div class="torn-remnant" aria-hidden="true"><span class="torn-label">Página rota</span></div>
    `
    return article
  }

  if (page.kind === 'cover') {
    article.innerHTML = `
      <img class="cover-image" src="/portada.jpg" alt="Portada ilustrada del diario" fetchpriority="high">
    `
    return article
  }

  if (page.kind === 'blank') return article

  if (page.kind === 'ending') {
    article.classList.add('page--ending')
    article.innerHTML = `
      <div class="ending-content">
        <h1>${escapeText(page.title)}</h1>
        <div class="ending-volume">${page.html}</div>
      </div>
    `
    return article
  }

  const isOwner = page.number === 1
  const hasSideImage = page.html.includes('polaroid--left') || page.html.includes('polaroid--right')
  const invisibleHasSideImage =
    page.invisible?.html.includes('polaroid--left') ||
    page.invisible?.html.includes('polaroid--right')
  const invisibleMarkup = page.invisible
    ? `
    <button class="invisible-toggle" type="button" aria-pressed="false" aria-label="Activar luz azul para revelar tinta invisible" title="Luz azul">✦</button>
    <div class="invisible-ink" aria-hidden="true">
      <div class="invisible-content">
        <header class="page-heading">
          <h2>${escapeText(page.invisible.title)}</h2>
        </header>
        <div class="page-body invisible-body${invisibleHasSideImage ? '' : ' page-body--spread'}">${page.invisible.html}</div>
      </div>
    </div>
  `
    : ''
  article.innerHTML = `
    <div class="page-paper${page.invisible ? ' page-paper--has-invisible' : ''}">
      <div class="page-content">
        <header class="page-heading">
          <h2>${escapeText(page.title)}</h2>
        </header>
        <div class="page-body${isOwner ? ' page-body--owner' : hasSideImage ? '' : ' page-body--spread'}">${page.html}</div>
      </div>
      <span class="page-folio">${String(page.number).padStart(2, '0')}</span>
      ${invisibleMarkup}
    </div>
  `

  const toggle = article.querySelector('.invisible-toggle')
  const paper = article.querySelector('.page-paper')
  const ink = article.querySelector('.invisible-ink')
  if (toggle && paper && ink) {
    toggle.addEventListener('click', () => {
      const isActive = paper.classList.toggle('page-paper--uv-active')
      toggle.setAttribute('aria-pressed', String(isActive))
      toggle.setAttribute(
        'aria-label',
        isActive ? 'Apagar luz azul' : 'Activar luz azul para revelar tinta invisible',
      )
      ink.setAttribute('aria-hidden', String(!isActive))
    })
    const moveLight = (event) => {
      if (!paper.classList.contains('page-paper--uv-active')) return
      const bounds = paper.getBoundingClientRect()
      paper.style.setProperty('--uv-x', `${event.clientX - bounds.left}px`)
      paper.style.setProperty('--uv-y', `${event.clientY - bounds.top}px`)
    }
    paper.addEventListener('pointermove', moveLight)
    paper.addEventListener('pointerdown', moveLight)
  }

  return article
}
