const escapeText = (text = '') =>
  text.replace(/[&<>"']/g, (char) => ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": "'" })[char])

function renderComments(comments) {
  if (!comments || comments.length === 0) return ''
  return comments.map((c) => `<div class="comment-block">${escapeText(c)}</div>`).join('')
}

export function createPage(page, side, nextPage = null) {
  const article = document.createElement('article')
  article.className = `page page--${page.kind} page--${side}`
  article.setAttribute(
    'aria-label',
    page.kind === 'missing'
      ? `Hoja arrancada ${page.number}`
      : `${page.title}, p&#225;gina ${page.number}`,
  )

  if (page.kind === 'missing') {
    if (!nextPage) article.classList.add('page--missing-end')
    article.innerHTML = `
      ${nextPage ? `<div class="under-sheet" aria-hidden="true">${createPage(nextPage, side).innerHTML}</div>` : ''}
      <div class="torn-remnant" aria-hidden="true"><span class="torn-label">P&#225;gina rota</span></div>
    `
    return article
  }

  if (page.kind === 'cover') {
    article.innerHTML = `
      <img class="cover-image" src="/portada.png" alt="Portada ilustrada del diario" fetchpriority="high">
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
  const hasComments = page.comments && page.comments.length > 0
  const invisibleHasComments = page.invisible?.comments && page.invisible.comments.length > 0

  const commentsMarkup = hasComments
    ? `
    <button class="comments-toggle" type="button" aria-pressed="false" aria-label="Activar luz roja para revelar comentarios" title="Luz roja">&#9670;</button>
    <div class="comments-ink" aria-hidden="true">
      <div class="comments-content">
        <header class="page-heading">
          <h2>${escapeText('Comentarios')}</h2>
        </header>
        <div class="page-body comments-body${hasSideImage ? '' : ' page-body--spread'}">${renderComments(page.comments)}</div>
      </div>
    </div>
  `
    : ''

  const invisibleMarkup = page.invisible
    ? `
    <button class="invisible-toggle" type="button" aria-pressed="false" aria-label="Activar luz azul para revelar tinta invisible" title="Luz azul">&#9830;</button>
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
    <div class="page-paper${page.invisible ? ' page-paper--has-invisible' : ''}${hasComments ? ' page-paper--has-comments' : ''}">
      <div class="page-content">
        <header class="page-heading">
          <h2>${escapeText(page.title)}</h2>
        </header>
        <div class="page-body${isOwner ? ' page-body--owner' : hasSideImage ? '' : ' page-body--spread'}">${page.html}</div>
      </div>
      <span class="page-folio">${String(page.number).padStart(2, '0')}</span>
      ${commentsMarkup}
      ${invisibleMarkup}
    </div>
  `

  const paper = article.querySelector('.page-paper')

  // Comments toggle (red light)
  const commentsToggle = article.querySelector('.comments-toggle')
  const commentsInk = article.querySelector('.comments-ink')
  if (commentsToggle && paper && commentsInk) {
    commentsToggle.addEventListener('click', () => {
      const isActive = paper.classList.toggle('page-paper--ir-active')
      commentsToggle.setAttribute('aria-pressed', String(isActive))
      commentsToggle.setAttribute(
        'aria-label',
        isActive ? 'Apagar luz roja' : 'Activar luz roja para revelar comentarios',
      )
      commentsInk.setAttribute('aria-hidden', String(!isActive))
    })
    const moveLight = (event) => {
      if (window.matchMedia('(max-width: 700px)').matches) return
      if (!paper.classList.contains('page-paper--ir-active')) return
      const bounds = paper.getBoundingClientRect()
      paper.style.setProperty('--ir-x', `${event.clientX - bounds.left}px`)
      paper.style.setProperty('--ir-y', `${event.clientY - bounds.top}px`)
    }
    paper.addEventListener('pointermove', moveLight)
    paper.addEventListener('pointerdown', moveLight)
  }

  // Invisible ink toggle (blue light)
  const toggle = article.querySelector('.invisible-toggle')
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
      if (window.matchMedia('(max-width: 700px)').matches) return
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

export function fitPageText(root) {
  const contentBlocks = root.querySelectorAll('.page-content, .invisible-content, .comments-content')

  contentBlocks.forEach((content) => {
    const body = content.querySelector('.page-body')
    if (!body) return

    content.classList.remove('page-content--dense')
    content.style.removeProperty('font-size')
    const baseSize = Number.parseFloat(getComputedStyle(content).fontSize)
    const fits = () => body.scrollHeight <= body.clientHeight + 1

    if (fits()) return

    content.classList.add('page-content--dense')
    let low = 10
    let high = baseSize
    let bestFit = null

    for (let attempt = 0; attempt < 9; attempt += 1) {
      const size = (low + high) / 2
      content.style.fontSize = `${size}px`
      if (fits()) {
        bestFit = size
        low = size
      } else {
        high = size
      }
    }

    content.style.fontSize = `${bestFit ?? 10}px`
  })
}
