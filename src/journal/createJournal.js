import { journalConfig } from '../config.js'
import { loadPages } from './loadPages.js'
import { createBook } from './components/Book.js'

export function createJournal(root) {
  const pages = loadPages(journalConfig)

  document.title = `${journalConfig.title} · ${journalConfig.author}`
  const description = document.querySelector('meta[name="description"]')
  if (description) description.content = journalConfig.description || ''

  root.innerHTML = `
    <main class="journal-shell">
      <div class="book-mount"></div>
    </main>
  `

  const book = createBook(pages, journalConfig.storageKey || `journal-${journalConfig.id}`)
  root.querySelector('.book-mount').append(book.element)
  root.querySelector('.journal-shell').append(book.lightControls)

  if (import.meta.hot) {
    import.meta.hot.accept('./loadPages.js', (updatedModule) => {
      if (updatedModule) book.updatePages(updatedModule.loadPages(journalConfig))
    })
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') book.turn(1)
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') book.turn(-1)
  })
}
