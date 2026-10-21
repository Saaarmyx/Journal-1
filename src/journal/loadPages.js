import { journalConfig } from '../config.js'
import { parseFrontmatter, renderMarkdown } from './markdown.js'

const markdownFiles = import.meta.glob('../content/pages/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function readPage(path, raw) {
  const filename = path.split('/').pop()
  if (filename.toLowerCase() === 'final.md') {
    const { meta, body } = parseFrontmatter(raw)
    const { html, comments } = renderMarkdown(body)
    return {
      id: 'final',
      isEnding: true,
      kind: 'ending',
      title: meta.title || 'Continúa en el diario',
      html,
      comments,
    }
  }
  const match = filename.match(/^(\d+)(?:-(invisible))?\.md$/i)
  if (!match) return null

  const number = Number(match[1])
  const isInvisible = Boolean(match[2])
  const { meta, body } = parseFrontmatter(raw)
  const { html, comments } = renderMarkdown(body)
  return {
    id: filename.replace(/\.md$/i, ''),
    number,
    isInvisible,
    kind: meta.kind || (number === 0 ? 'cover' : 'page'),
    title: meta.title || `Página ${String(number).padStart(2, '0')}`,
    date: meta.date || '',
    html,
    comments,
  }
}

export function loadPages() {
  const found = Object.entries(markdownFiles)
    .map(([path, raw]) => readPage(path, raw))
    .filter(Boolean)
    .sort((a, b) => a.number - b.number)
  const ending = found.find((page) => page.isEnding)
  const numberedPages = found.filter((page) => !page.isEnding)
  const pagesByNumber = new Map(numberedPages.filter((page) => !page.isInvisible).map((page) => [page.number, page]))
  const invisibleByNumber = new Map(numberedPages.filter((page) => page.isInvisible).map((page) => [page.number, page]))

  // Find the last real page number (non-invisible, non-ending)
  const realPageNumbers = [...pagesByNumber.keys()].filter(n => n > 0)
  const lastRealPage = realPageNumbers.length > 0 ? Math.max(...realPageNumbers) : 0
  const configuredLastPage = journalConfig.lastPageNumber

  // Build pages up to lastRealPage, filling gaps with 'missing' (torn) pages
  const pages = Array.from({ length: lastRealPage + 1 }, (_, number) => {
    const page = pagesByNumber.get(number)
    if (page) {
      const invisible = invisibleByNumber.get(number)
      return invisible ? { ...page, invisible: { title: invisible.title, html: invisible.html, comments: invisible.comments } } : page
    }
    const invisible = invisibleByNumber.get(number)
    if (invisible) {
      return {
        id: `blank-${number}`,
        number,
        kind: 'page',
        title: '',
        html: '',
        comments: [],
        invisible: { title: invisible.title, html: invisible.html, comments: invisible.comments },
      }
    }
    // Gap in the middle -> torn page
    return {
      id: `missing-${number}`,
      number,
      kind: 'missing',
      title: 'Hoja arrancada',
      html: '',
      comments: [],
    }
  })

  // If journal ends before configured last page, add ONE torn page to indicate continuation
  if (lastRealPage < configuredLastPage) {
    pages.push({
      id: `missing-${lastRealPage + 1}`,
      number: lastRealPage + 1,
      kind: 'missing',
      title: 'Hoja arrancada',
      html: '',
      comments: [],
    })
  }

  if (ending) {
    // Keep the closing page on the right side of a desktop spread.
    if (pages.length % 2 === 0) {
      pages.push({ id: 'ending-spacer', number: pages.length, kind: 'blank', title: '', html: '', comments: [] })
    }
    pages.push({ ...ending, number: pages.length, comments: ending.comments || [] })
  }

  return pages
}
