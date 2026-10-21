const escapeHtml = (value = '') => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

function safeUrl(value, image = false) {
  const trimmed = value.trim()
  if (/^(javascript|vbscript|data):/i.test(trimmed)) return ''
  if (image && trimmed.startsWith('//')) return ''
  return trimmed
}

export function renderInline(source) {
  const chunks = []
  const hold = (html) => `\u0000${chunks.push(html) - 1}\u0000`

  let text = source
    .replace(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)(?:\s+\{(left|right)\})?/g, (_match, alt, url, caption = '', side = '') => {
      const imageUrl = safeUrl(url, true)
      if (!imageUrl) return escapeHtml(alt)
      const sideClass = side ? ` polaroid--${side}` : ''
      return hold(`<figure class="polaroid${sideClass}"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(alt)}" loading="lazy"><figcaption>${escapeHtml(caption || alt)}</figcaption></figure>`)
    })
    .replace(/\[([^\]]+)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)/g, (_match, label, url, title = '') => {
      const href = safeUrl(url)
      if (!href) return escapeHtml(label)
      return hold(`<a href="${escapeHtml(href)}"${title ? ` title="${escapeHtml(title)}"` : ''}>${escapeHtml(label)}</a>`)
    })
    .replace(/`([^`]+)`/g, (_match, code) => hold(`<code>${escapeHtml(code)}</code>`))

  text = escapeHtml(text)
    .replace(/~~(.+?)~~/g, '<del class="journal-strikethrough">$1</del>')
    .replace(/\+\+(.+?)\+\+/g, '<u>$1</u>')
    .replace(/==(.+?)==/g, '<mark>$1</mark>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>')

  return text.replace(/\u0000(\d+)\u0000/g, (_match, index) => chunks[Number(index)])
}

export function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: markdown }

  const meta = Object.fromEntries(match[1].split(/\r?\n/).flatMap((line) => {
    const divider = line.indexOf(':')
    if (divider < 1) return []
    const key = line.slice(0, divider).trim()
    const value = line.slice(divider + 1).trim().replace(/^['"]|['"]$/g, '')
    return [[key, value]]
  }))
  return { meta, body: match[2] }
}

function extractComments(markdown) {
  const comments = []
  const cleaned = markdown.replace(/<!--([\s\S]*?)-->/g, (match, content) => {
    comments.push(content.trim())
    return ''
  })
  return { markdown: cleaned, comments }
}

export function renderMarkdown(markdown) {
  const { markdown: cleanedMarkdown, comments } = extractComments(markdown)
  const lines = cleanedMarkdown.replaceAll('\r\n', '\n').split('\n')
  const output = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) { index += 1; continue }

    if (line.startsWith('```')) {
      const language = escapeHtml(line.slice(3).trim())
      const code = []
      index += 1
      while (index < lines.length && !lines[index].startsWith('```')) code.push(lines[index++])
      if (index < lines.length) index += 1
      output.push(`<pre class="journal-code"><code${language ? ` class="language-${language}"` : ''}>${escapeHtml(code.join('\n'))}</code></pre>`)
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      const level = heading[1].length
      output.push(`<h${level} class="journal-h${level}">${renderInline(heading[2])}</h${level}>`)
      index += 1
      continue
    }

    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      output.push('<hr class="journal-rule">')
      index += 1
      continue
    }

    if (/^\s*!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)(?:\s+\{(?:left|right)\})?\s*$/.test(line)) {
      output.push(renderInline(line.trim()))
      index += 1
      continue
    }

    if (/^>\s?/.test(line)) {
      const quote = []
      while (index < lines.length && /^>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ''))
      output.push(`<blockquote>${quote.map(renderInline).join('<br>')}</blockquote>`)
      continue
    }

    const listMatch = line.match(/^\s*([-*+]|\d+\.)\s+(.+)$/)
    if (listMatch) {
      const ordered = /^\d/.test(listMatch[1])
      const tag = ordered ? 'ol' : 'ul'
      const items = []
      while (index < lines.length) {
        const item = lines[index].match(/^\s*([-*+]|\d+\.)\s+(.+)$/)
        if (!item || /^\d/.test(item[1]) !== ordered) break
        items.push(`<li>${renderInline(item[2])}</li>`)
        index += 1
      }
      output.push(`<${tag} class="journal-list">${items.join('')}</${tag}>`)
      continue
    }

    const paragraph = [line]
    index += 1
    while (index < lines.length && lines[index].trim() && !/^(#{1,3})\s+|^```|^>\s?|^\s*([-*+]|\d+\.)\s+|^\s*!\[/.test(lines[index])) {
      paragraph.push(lines[index++])
    }
    output.push(`<p>${paragraph.map(renderInline).join('<br>')}</p>`)
  }

  return { html: output.join('\n'), comments }
}
