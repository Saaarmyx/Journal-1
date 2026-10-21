import { parseFrontmatter, renderMarkdown } from './markdown.js'

const markdownFiles = import.meta.glob('../content/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function readPage(path, raw) {
  const filename = path.split('/').pop()
  if (/^final-before\.md$/i.test(filename)) {
    const { meta, body } = parseFrontmatter(raw)
    const { html, comments } = renderMarkdown(body)
    const plainImagesHtml = html.replace(
      /<figure class="polaroid polaroid--(left|right)"><img src="([^"]*)" alt="([^"]*)" loading="lazy"><figcaption>[\s\S]*?<\/figcaption><\/figure>/g,
      '<img class="final-before-image final-before-image--$1" src="$2" alt="$3" loading="lazy">',
    )
    return {
      id: 'final-before',
      isFinalBefore: true,
      kind: 'final-before',
      invisible: { title: meta.title?.trim() || '', html: plainImagesHtml, comments },
    }
  }

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

export function loadPages(volume = { contentDirectory: 'pages', cover: '/portada.png' }) {
  const contentDirectory = volume.contentDirectory.replace(/^\/+|\/+$/g, '')
  const contentPrefix = `../content/${contentDirectory}/`
  const found = Object.entries(markdownFiles)
    .filter(([path]) => path.startsWith(contentPrefix))
    .map(([path, raw]) => readPage(path, raw))
    .filter(Boolean)
    .filter((page) => page.isInvisible || page.isFinalBefore || page.kind === 'cover' || page.title)
    .sort((a, b) => a.number - b.number)
  const ending = found.find((page) => page.isEnding)
  const finalBefore = found.find((page) => page.isFinalBefore)
  const numberedPages = found.filter((page) => !page.isEnding && !page.isFinalBefore)
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
      const withCover = page.kind === 'cover'
        ? { ...page, coverSrc: volume.cover || '/portada.png', coverAlt: volume.coverAlt || 'Portada ilustrada del diario' }
        : page
      return invisible ? { ...withCover, invisible: { title: invisible.title, html: invisible.html, comments: invisible.comments } } : withCover
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

  if (finalBefore) {
    pages.push({ ...finalBefore, number: pages.length })
  }

  if (ending) {
    // Keep one ending page. Its left/right position follows naturally from the sequence.
    pages.push({ ...ending, number: pages.length, comments: ending.comments || [] })
  }

  return pages
}
