import { renderInline } from '../markdown.js'

const escapeText = (text = '') =>
  text.replace(/[&<>"']/g, (char) => ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": "'" })[char])

function renderComments(comments) {
  if (!comments || comments.length === 0) return ''
  return comments.map((c) => `<div class="comment-block">${escapeText(c)}</div>`).join('')
}

export function createPage(page, side, nextPage = null) {
  const article = document.createElement('article')
  article.className = `page page--${page.kind} page--${side}`
  const accessibleTitle = page.title?.trim()
  article.setAttribute(
    'aria-label',
    page.kind === 'missing'
      ? `Hoja arrancada ${page.number}`
      : `${accessibleTitle ? `${accessibleTitle}, ` : ''}página ${page.number}`,
  )

  const moveBlueLight = (event) => {
    if (window.matchMedia('(max-width: 700px)').matches) return
    if (!article.classList.contains('page--uv-active')) return

    const surface = event.target.closest('.page-paper') || article
    const bounds = surface.getBoundingClientRect()
    surface.style.setProperty('--uv-x', `${event.clientX - bounds.left}px`)
    surface.style.setProperty('--uv-y', `${event.clientY - bounds.top}px`)
  }
  article.addEventListener('pointermove', moveBlueLight)
  article.addEventListener('pointerdown', moveBlueLight)

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
        ${page.title ? `<h1>${renderInline(page.title)}</h1>` : ''}
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
    <div class="invisible-ink" aria-hidden="true">
      <div class="invisible-content">
        ${page.invisible.title ? `
        <header class="page-heading">
          <h2>${renderInline(page.invisible.title)}</h2>
        </header>` : ''}
        <div class="page-body invisible-body${invisibleHasSideImage ? '' : ' page-body--spread'}">${page.invisible.html}</div>
      </div>
    </div>
  `
    : ''

  article.innerHTML = `
    <div class="page-paper${page.invisible ? ' page-paper--has-invisible' : ''}${hasComments ? ' page-paper--has-comments' : ''}">
      <div class="page-content">
        ${page.title ? `
        <header class="page-heading">
          <h2>${renderInline(page.title)}</h2>
        </header>` : ''}
        <div class="page-body${isOwner ? ' page-body--owner' : hasSideImage ? '' : ' page-body--spread'}">${page.html}</div>
      </div>
      <span class="page-folio">${String(page.number).padStart(2, '0')}</span>
      ${commentsMarkup}
      ${invisibleMarkup}
    </div>
  `

  const paper = article.querySelector('.page-paper')

  // Comments toggle (red light)
  const commentsInk = article.querySelector('.comments-ink')
  if (paper && commentsInk) {
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

  return article
}

export function setInvisibleLight(article, active) {
  article.classList.toggle('page--uv-active', active)
  const paper = article.querySelector('.page-paper')
  const ink = article.querySelector('.invisible-ink')
  if (paper) paper.classList.toggle('page-paper--uv-active', active)
  if (ink) ink.setAttribute('aria-hidden', String(!active))
}

export function setCommentsLight(article, active) {
  const paper = article.querySelector('.page-paper')
  const ink = article.querySelector('.comments-ink')
  if (!paper || !ink) return

  paper.classList.toggle('page-paper--ir-active', active)
  ink.setAttribute('aria-hidden', String(!active))
}

export function fitPageText(root) {
  const contentBlocks = root.querySelectorAll('.page-content, .invisible-content, .comments-content')

  contentBlocks.forEach((content) => {
    const body = content.querySelector('.page-body')
    if (!body) return

    content.classList.remove('page-content--dense')
    content.style.removeProperty('font-size')
    content.style.removeProperty('--journal-image-height')
    const baseSize = Number.parseFloat(getComputedStyle(content).fontSize) || 18
    const fits = () => body.scrollHeight <= body.clientHeight + 1
    const isMobile = window.matchMedia('(max-width: 700px)').matches
    const minimumSize = 10
    const maximumSize = isMobile ? 25 : 32
    const images = [...body.querySelectorAll('.polaroid img')]
    const preferredImageHeight = images.length
      ? Math.min(
        isMobile ? Math.min(window.innerHeight * 0.12, 120) : Math.min(window.innerHeight * 0.28, 240),
        (body.clientHeight / images.length) * 0.72,
      )
      : 0

    const applyScale = (scale) => {
      const fontSize = scale <= 1
        ? minimumSize + (baseSize - minimumSize) * scale
        : baseSize + (maximumSize - baseSize) * ((scale - 1) / 0.5)
      content.style.fontSize = `${Math.min(maximumSize, fontSize)}px`

      if (images.length) {
        const imageHeight = Math.min(preferredImageHeight * scale, body.clientHeight * 0.35)
        content.style.setProperty('--journal-image-height', `${Math.max(0, imageHeight)}px`)
      }
    }

    applyScale(1)
    if (!fits()) content.classList.add('page-content--dense')

    let low = 0
    let high = 1.5
    let bestFit = 0

    for (let attempt = 0; attempt < 12; attempt += 1) {
      const size = (low + high) / 2
      applyScale(size)
      if (fits()) {
        bestFit = size
        low = size
      } else {
        high = size
      }
    }

    applyScale(bestFit)
  })
}
