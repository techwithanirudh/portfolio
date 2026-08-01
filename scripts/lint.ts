import {
  type FileObject,
  printErrors,
  scanURLs,
  validateFiles,
} from 'next-validate-link'
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
          hashes: getHeadings(page),
          value: {
            slug: page.slugs[0] ?? '',
          },
        }))
      ),
      '(home)/work/[slug]': await Promise.all(
        workPages.map((page) => ({
          hashes: getHeadings(page),
          value: {
            slug: page.slugs[0] ?? '',
          },
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
        checkRelativePaths: 'as-url',
        markdown: {
          components: {
            Card: { attributes: ['href'] },
          },
        },
        scanned,
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

async function getFiles(pages: BlogPage[] | WorkPage[]) {
  const files: FileObject[] = []
  for (const page of pages) {
    files.push({
      content: await page.data.getText('raw'),
      data: page.data,
      path: page.data.info.fullPath,
      url: page.url,
    })
  }

  return files
}

checkLinks().catch((error) => {
  console.error('Failed to validate links.', error)
  process.exitCode = 1
})
