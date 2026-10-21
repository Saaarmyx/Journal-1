import { journalConfig } from '../config.js'
import { loadPages } from './loadPages.js'
import { createBook } from './components/Book.js'

function findJournal(id) {
  return journalConfig.journals.find((journal) => journal.id === id) ||
    journalConfig.journals.find((journal) => journal.id === journalConfig.defaultJournalId) ||
    journalConfig.journals[0]
}

function findVolume(journal, id) {
  return journal.volumes.find((volume) => volume.id === id) ||
    journal.volumes.find((volume) => volume.id === journal.defaultVolumeId) ||
    journal.volumes[0]
}

function makePicker(className, label, options, selectedId, onChange) {
  if (options.length < 2) return null

  const picker = document.createElement('select')
  picker.className = `journal-picker ${className}`
  picker.setAttribute('aria-label', label)
  for (const option of options) {
    const item = document.createElement('option')
    item.value = option.id
    item.textContent = option.label
    picker.append(item)
  }
  picker.value = selectedId
  picker.addEventListener('change', () => onChange(picker.value))
  return picker
}

function navigateTo(journalId, volumeId) {
  const url = new URL(window.location.href)
  url.searchParams.set('journal', journalId)
  url.searchParams.set('volume', volumeId)
  window.location.assign(url)
}

export function createJournal(root) {
  if (journalConfig.journals.length === 0) {
    throw new Error('Agrega al menos un diario y un tomo en src/config.js.')
  }

  const params = new URLSearchParams(window.location.search)
  const journal = findJournal(params.get('journal') || journalConfig.defaultJournalId)
  if (!journal?.volumes?.length) {
    throw new Error(`El diario "${journal?.id || ''}" necesita al menos un tomo.`)
  }
  const volume = findVolume(journal, params.get('volume'))
  const pages = loadPages(volume)

  document.title = `${journal.title} · Tomo ${volume.id} · ${journal.author}`
  const description = document.querySelector('meta[name="description"]')
  if (description) description.content = journal.description

  root.innerHTML = `
    <main class="journal-shell">
      <div class="book-mount"></div>
    </main>
  `

  const storageKey = volume.storageKey || `journal-${journal.id}-${volume.id}`
  const book = createBook(pages, storageKey)
  root.querySelector('.book-mount').append(book.element)
  const lightControls = book.lightControls
  const journalPicker = makePicker(
    'journal-picker--journal',
    'Seleccionar diario',
    journalConfig.journals.map((item) => ({ id: item.id, label: item.title })),
    journal.id,
    (nextJournalId) => {
      const nextJournal = findJournal(nextJournalId)
      const nextVolume = findVolume(nextJournal, nextJournal.defaultVolumeId)
      navigateTo(nextJournal.id, nextVolume.id)
    },
  )
  const volumePicker = makePicker(
    'journal-picker--volume',
    'Seleccionar tomo',
    journal.volumes.map((item) => ({ id: item.id, label: item.title || `Tomo ${item.id}` })),
    volume.id,
    (nextVolumeId) => navigateTo(journal.id, nextVolumeId),
  )
  if (journalPicker) lightControls.prepend(journalPicker)
  if (volumePicker) lightControls.prepend(volumePicker)
  root.querySelector('.journal-shell').append(lightControls)

  if (import.meta.hot) {
    import.meta.hot.accept('./loadPages.js', (updatedModule) => {
      if (updatedModule) book.updatePages(updatedModule.loadPages(volume))
    })
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') book.turn(1)
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') book.turn(-1)
  })
}
