import { loadPages } from './loadPages.js'
import { createBook } from './components/Book.js'

export function createJournal(root) {
  const pages = loadPages()
  root.innerHTML = `
    <main class="journal-shell">
      <div class="book-mount"></div>
    </main>
  `

  const book = createBook(pages)
  root.querySelector('.book-mount').append(book.element)
  root.querySelector('.journal-shell').append(book.invisibleToggle)

  if (import.meta.hot) {
    import.meta.hot.accept('./loadPages.js', (updatedModule) => {
      if (updatedModule) book.updatePages(updatedModule.loadPages())
    })
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') book.turn(1)
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') book.turn(-1)
  })
}
