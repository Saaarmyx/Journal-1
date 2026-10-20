import { journalConfig } from '../config.js'
import { parseFrontmatter, renderMarkdown } from './markdown.js'

const markdownFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function readPage(path, raw) {
  const filename = path.split('/').pop()
  const match = filename.match(/^(\d+)(?:-(invisible))?\.md$/i)
  if (!match) return null

  const number = Number(match[1])
  const isInvisible = Boolean(match[2])
  const { meta, body } = parseFrontmatter(raw)
  return {
    id: filename.replace(/\.md$/i, ''),
    number,
    isInvisible,
    kind: meta.kind || (number === 0 ? 'cover' : 'page'),
    title: meta.title || `Página ${String(number).padStart(2, '0')}`,
    date: meta.date || '',
    html: renderMarkdown(body),
  }
}

export function loadPages() {
  const found = Object.entries(markdownFiles)
    .map(([path, raw]) => readPage(path, raw))
    .filter(Boolean)
    .sort((a, b) => a.number - b.number)
  const pagesByNumber = new Map(found.filter((page) => !page.isInvisible).map((page) => [page.number, page]))
  const invisibleByNumber = new Map(found.filter((page) => page.isInvisible).map((page) => [page.number, page]))
  const lastNumber = Math.max(journalConfig.lastPageNumber, ...pagesByNumber.keys(), 1)

  return Array.from({ length: lastNumber + 1 }, (_, number) => {
    const page = pagesByNumber.get(number)
    if (page) {
      const invisible = invisibleByNumber.get(number)
      return invisible ? { ...page, invisible: { title: invisible.title, html: invisible.html } } : page
    }
    return {
      id: `missing-${number}`,
      number,
      kind: 'missing',
      title: 'Hoja arrancada',
      html: '',
    }
  })
}
