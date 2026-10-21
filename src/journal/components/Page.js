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
    const minimumSize = isMobile ? 13 : 15
    const maximumSize = isMobile ? 25 : 32
    const images = [...body.querySelectorAll('.polaroid img')]
    const mediaPolaroids = [...body.querySelectorAll('.journal-media-row .polaroid')]
    mediaPolaroids.forEach((polaroid) => polaroid.style.removeProperty('--journal-image-width'))
    const preferredImageHeight = images.length
      ? Math.min(
        isMobile ? Math.min(window.innerHeight * 0.1, 100) : Math.min(window.innerHeight * 0.16, 150),
        (body.clientHeight / images.length) * 0.45,
      )
      : 0

    mediaPolaroids.forEach((polaroid) => {
      const columnWidth = polaroid.getBoundingClientRect().width
      const imageWidth = Math.min(columnWidth * 0.88, body.clientWidth * 0.38)
      polaroid.style.setProperty('--journal-image-width', `${imageWidth}px`)
    })

    const setImageHeight = (height) => {
      if (images.length) content.style.setProperty('--journal-image-height', `${Math.max(0, height)}px`)
    }

    content.style.fontSize = `${baseSize}px`
    setImageHeight(preferredImageHeight)

    let imageHeight = preferredImageHeight
    const minimumImageHeight = isMobile ? 32 : 48
    while (images.length && !fits() && imageHeight > minimumImageHeight) {
      imageHeight = Math.max(minimumImageHeight, imageHeight - 4)
      setImageHeight(imageHeight)
    }

    if (!fits()) {
      content.classList.add('page-content--dense')
      if (!fits()) {
        let low = minimumSize
        let high = baseSize
        let bestFit = minimumSize

        for (let attempt = 0; attempt < 12; attempt += 1) {
          const size = (low + high) / 2
          content.style.fontSize = `${size}px`
          if (fits()) {
            bestFit = size
            low = size
          } else {
            high = size
          }
        }

        content.style.fontSize = `${bestFit}px`
      }
    }

    while (images.length && !fits() && imageHeight > 0) {
      imageHeight = Math.max(0, imageHeight - 4)
      setImageHeight(imageHeight)
    }

    if (fits()) {
      let low = Number.parseFloat(content.style.fontSize)
      let high = maximumSize
      let bestFit = low

      for (let attempt = 0; attempt < 12; attempt += 1) {
        const size = (low + high) / 2
        content.style.fontSize = `${size}px`
        if (fits()) {
          bestFit = size
          low = size
        } else {
          high = size
        }
      }

      content.style.fontSize = `${bestFit}px`
    }
  })
}
