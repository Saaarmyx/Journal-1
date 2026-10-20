import { createPage } from './Page.js'

export function createBook(pages) {
  let spreadIndex = 0
  let pageIndex = 0
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
    render()
  }

  previous.addEventListener('click', () => turn(-1))
  next.addEventListener('click', () => turn(1))
  mobileQuery.addEventListener('change', render)
  book.append(spread, previous, next)
  render()

  return { element: book, turn }
}
