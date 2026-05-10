import { printErrors, scanURLs, validateFiles } from 'next-validate-link'
import {
  type BlogPage,
  getPosts,
  getWorkPages,
  type WorkPage,
} from '@/lib/source'

async function checkLinks() {
  const posts = getPosts()
  const workPages = getWorkPages()

  const scanned = await scanURLs({
    populate: {
      '(home)/(blog)/blog/[slug]': await Promise.all(
        posts.map((page) => ({
          value: {
            slug: page.slugs[0] ?? '',
          },
          hashes: getHeadings(page),
        }))
      ),
      '(home)/work/[slug]': await Promise.all(
        workPages.map((page) => ({
          value: {
            slug: page.slugs[0] ?? '',
          },
          hashes: getHeadings(page),
        }))
      ),
    },
  })

  console.log(
    `collected ${scanned.urls.size} URLs, ${scanned.fallbackUrls.length} fallbacks`
  )

  printErrors(
    await validateFiles(
      [...(await getFiles(workPages)), ...(await getFiles(posts))],
      {
        scanned,
        markdown: {
          components: {
            Card: { attributes: ['href'] },
          },
        },
        checkRelativePaths: 'as-url',
      }
    ),
    true
  )
}

function getHeadings({ data }: BlogPage | WorkPage): string[] {
  const { _exports, toc } = data
  const headings = toc?.map((item) => item.url.slice(1)) ?? []
  const elementIds = _exports?.elementIds
  if (Array.isArray(elementIds)) {
    headings.push(...elementIds)
  }

  return headings
}

function getFiles(pages: BlogPage[] | WorkPage[]) {
  return Promise.all(
    pages.map(async (page) => ({
      data: page.data,
      url: page.url,
      path: page.data.info.fullPath,
      content: await page.data.getText('raw'),
    }))
  )
}

checkLinks().catch((error) => {
  console.error('Failed to validate links.', error)
  process.exitCode = 1
})
