import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { TOPBAR_ITEMS } from './src/constants.js'

const ROUTES = TOPBAR_ITEMS.map(item => ({
  path: item.path,
  title: `${item.label} — OneWay.asia`,
  description: `${item.label} services by OneWay.asia — Project Management and Consulting company.`,
}))

const template = readFileSync('dist/index.html', 'utf-8')

for (const route of ROUTES) {
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(
      '</head>',
      `  <meta name="description" content="${route.description}">\n` +
      `  <meta property="og:title" content="${route.title}">\n` +
      `  <meta property="og:description" content="${route.description}">\n` +
      `  <meta property="og:url" content="https://oneway.asia${route.path}">\n` +
      `</head>`
    )

  const dir = join('dist', route.path.slice(1))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html, 'utf-8')
  console.log(`✓ ${route.path}/index.html`)
}

console.log('Prerender complete.')
