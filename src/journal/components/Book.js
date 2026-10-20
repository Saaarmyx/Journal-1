import { createPage } from './Page.js'

export function createBook(pages) {
  let spreadIndex = 0
  const maxSpread = Math.ceil(pages.length / 2) - 1
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
  }

  function turn(amount) {
    spreadIndex = Math.max(0, Math.min(maxSpread, spreadIndex + amount))
    render()
  }

  previous.addEventListener('click', () => turn(-1))
  next.addEventListener('click', () => turn(1))
  book.append(spread, previous, next)
  render()

  return { element: book, turn }
}
