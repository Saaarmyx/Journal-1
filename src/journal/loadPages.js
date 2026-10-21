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
      title: meta.title?.trim() || '',
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
    title: meta.title?.trim() || '',
    date: meta.date || '',
    html,
    comments,
  }
}

export function loadPages() {
  const found = Object.entries(markdownFiles)
    .map(([path, raw]) => readPage(path, raw))
    .filter(Boolean)
    .filter((page) => page.isInvisible || page.kind === 'cover' || page.title)
    .sort((a, b) => a.number - b.number)
  const ending = found.find((page) => page.isEnding)
  const numberedPages = found.filter((page) => !page.isEnding)
  const pagesByNumber = new Map(numberedPages.filter((page) => !page.isInvisible).map((page) => [page.number, page]))
  const invisibleByNumber = new Map(numberedPages.filter((page) => page.isInvisible).map((page) => [page.number, page]))

  // The sequence is defined by the files that exist, including invisible-only pages.
  // Gaps before the last authored page are torn pages; nothing is invented afterward.
  const authoredPageNumbers = [...pagesByNumber.keys(), ...invisibleByNumber.keys()]
  const lastPageNumber = authoredPageNumbers.length > 0
    ? Math.max(...authoredPageNumbers)
    : 0

  const pages = Array.from({ length: lastPageNumber + 1 }, (_, number) => {
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
    // A missing number before a later authored page represents a torn page.
    return {
      id: `missing-${number}`,
      number,
      kind: 'missing',
      title: 'Hoja arrancada',
      html: '',
      comments: [],
    }
  })

  if (ending) {
    // Keep one ending page. Its left/right position follows naturally from the sequence.
    pages.push({ ...ending, number: pages.length, comments: ending.comments || [] })
  }

  return pages
}
