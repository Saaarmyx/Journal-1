import { createPage } from './Page.js'

const STORAGE_KEY = 'journal-current-page'

function getStoredPage(pages) {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const pageNum = Number(stored)
    const page = pages.find(p => p.number === pageNum)
    if (page) return pageNum
  }
  return 0
}

export function createBook(pages) {
  const storedPage = getStoredPage(pages)
  let pageIndex = storedPage
  let spreadIndex = Math.floor(storedPage / 2)
  let activeGesture = null
  let turnTimer = null
  let settleTimer = null
  const maxSpread = Math.ceil(pages.length / 2) - 1
  const mobileQuery = window.matchMedia('(max-width: 700px)')
  let mobileMode = mobileQuery.matches
  const book = document.createElement('section')
  book.className = 'book'
  book.setAttribute('aria-label', 'Diario abierto')

  const spread = document.createElement('div')
  spread.className = 'book-spread'
  spread.setAttribute('aria-live', 'polite')

  const gutter = document.createElement('div')
  gutter.className = 'book-gutter'
  gutter.setAttribute('aria-hidden', 'true')

  const previous = document.createElement('button')
  previous.className = 'turn-control turn-control--previous'
  previous.type = 'button'
  previous.setAttribute('aria-label', 'Doble página anterior')
  previous.innerHTML = '<span aria-hidden="true">‹</span>'

  const next = document.createElement('button')
  next.className = 'turn-control turn-control--next'
  next.type = 'button'
  next.setAttribute('aria-label', 'Doble página siguiente')
  next.innerHTML = '<span aria-hidden="true">›</span>'

  function followingPage(number) {
    return pages.find((page) => page.number > number && page.kind !== 'missing') || null
  }

  function render() {
    const nextMobileMode = mobileQuery.matches
    if (nextMobileMode !== mobileMode) {
      if (nextMobileMode) pageIndex = Math.min(pages.length - 1, spreadIndex * 2)
      else spreadIndex = Math.floor(pageIndex / 2)
      mobileMode = nextMobileMode
    }

    if (mobileMode) {
      const page = pages[pageIndex]
      spread.replaceChildren(createPage(
        page,
        'left',
        page.kind === 'missing' ? followingPage(page.number) : null,
      ))
      previous.disabled = pageIndex === 0
      next.disabled = pageIndex >= pages.length - 1
      previous.setAttribute('aria-label', 'Página anterior')
      next.setAttribute('aria-label', 'Página siguiente')
      return
    }

    const left = pages[spreadIndex * 2]
    const right = pages[spreadIndex * 2 + 1]
    spread.replaceChildren(
      createPage(left, 'left', left.kind === 'missing' ? followingPage(left.number) : null),
      gutter,
      right
        ? createPage(right, 'right', right.kind === 'missing' ? followingPage(right.number) : null)
        : createPage({ kind: 'missing', number: left.number + 1 }, 'right', followingPage(left.number + 1)),
    )
    previous.disabled = spreadIndex === 0
    next.disabled = spreadIndex >= maxSpread
    previous.setAttribute('aria-label', 'Doble página anterior')
    next.setAttribute('aria-label', 'Doble página siguiente')
  }

  function turn(amount) {
    if (mobileMode) pageIndex = Math.max(0, Math.min(pages.length - 1, pageIndex + amount))
    else spreadIndex = Math.max(0, Math.min(maxSpread, spreadIndex + amount))
    savePosition()
    render()
  }

  function savePosition() {
    const currentPage = mobileMode
      ? pages[pageIndex]
      : pages[spreadIndex * 2]
    if (currentPage) {
      localStorage.setItem(STORAGE_KEY, String(currentPage.number))
    }
  }

  function settleGesture(page) {
    page.classList.remove('page--dragging', 'page--drag-release')
    page.classList.add('page--drag-settling')
    page.style.setProperty('--drag-x', '0px')
    window.clearTimeout(settleTimer)
    settleTimer = window.setTimeout(() => {
      page.classList.remove('page--drag-settling')
      page.style.removeProperty('--drag-x')
    }, 190)
  }

  spread.addEventListener('pointerdown', (event) => {
    if (!mobileMode || event.pointerType === 'mouse' || turnTimer !== null) return
    if (event.target.closest('button, a, input, textarea, select, [data-no-page-turn]')) return

    const page = spread.querySelector('.page')
    if (!page) return

    activeGesture = {
      pointerId: event.pointerId,
      page,
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      axis: null,
      startedAt: performance.now(),
    }
    page.classList.add('page--dragging')
    spread.setPointerCapture(event.pointerId)
  })

  spread.addEventListener('pointermove', (event) => {
    if (!activeGesture || event.pointerId !== activeGesture.pointerId) return

    const deltaX = event.clientX - activeGesture.startX
    const deltaY = event.clientY - activeGesture.startY
    if (!activeGesture.axis && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 7) {
      activeGesture.axis = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
    }
    if (activeGesture.axis === 'vertical') {
      settleGesture(activeGesture.page)
      activeGesture = null
      return
    }
    if (activeGesture.axis !== 'horizontal') return

    event.preventDefault()
    activeGesture.deltaX = deltaX
    activeGesture.page.style.setProperty('--drag-x', `${deltaX}px`)
  }, { passive: false })

  function finishGesture(event, cancelled = false) {
    if (!activeGesture || event.pointerId !== activeGesture.pointerId) return

    const gesture = activeGesture
    activeGesture = null
    const elapsed = Math.max(performance.now() - gesture.startedAt, 1)
    const distance = Math.abs(gesture.deltaX)
    const velocity = distance / elapsed
    const direction = gesture.deltaX < 0 ? 1 : -1
    const pastEdge = (direction < 0 && pageIndex === 0) || (direction > 0 && pageIndex >= pages.length - 1)

    if (cancelled || pastEdge || (distance < 52 && velocity < 0.45)) {
      settleGesture(gesture.page)
      return
    }

    gesture.page.classList.remove('page--dragging')
    gesture.page.classList.add('page--drag-release')
    gesture.page.style.setProperty('--drag-x', direction > 0 ? '-110%' : '110%')
    turnTimer = window.setTimeout(() => {
      turnTimer = null
      turn(direction)
    }, 150)
  }

  spread.addEventListener('pointerup', (event) => finishGesture(event))
  spread.addEventListener('pointercancel', (event) => finishGesture(event, true))

  previous.addEventListener('click', () => turn(-1))
  next.addEventListener('click', () => turn(1))
  mobileQuery.addEventListener('change', render)
  book.append(spread, previous, next)
  render()

  return { element: book, turn }
}
