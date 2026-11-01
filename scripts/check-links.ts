import {
  type FileObject,
  printErrors,
  scanURLs,
  validateFiles,
} from 'next-validate-link'
import {
  type BlogPage,
  getPosts,
  getProjectPages,
  getTags,
  type ProjectPage,
} from '@/lib/source'

async function checkLinks() {
  const posts = getPosts()
  const projectPages = getProjectPages()

  const scanned = await scanURLs({
    populate: {
      '(home)/blog/[slug]': toParams(posts),
      '(home)/blog/tags/[tag]': getTags().map((tag) => ({
        value: { tag },
      })),
      '(home)/projects/[slug]': toParams(projectPages),
    },
  })

  console.log(
    `collected ${scanned.urls.size} URLs, ${scanned.fallbackUrls.length} fallbacks`
  )

  printErrors(
    await validateFiles(
      [...(await getFiles(projectPages)), ...(await getFiles(posts))],
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

function toParams(pages: BlogPage[] | ProjectPage[]) {
  return pages.map((page) => ({
    hashes: getHeadings(page),
    value: {
      slug: page.slugs[0] ?? '',
    },
  }))
}

function getHeadings({ data }: BlogPage | ProjectPage): string[] {
  const { _exports, toc } = data
  const headings = toc?.map((item) => item.url.slice(1)) ?? []
  const elementIds = _exports.elementIds
  if (Array.isArray(elementIds)) {
    headings.push(...elementIds)
  }

  return headings
}

function getFiles(pages: BlogPage[] | ProjectPage[]): Promise<FileObject[]> {
  return Promise.all(
    pages.map(async (page) => ({
      content: await page.data.getText('raw'),
      data: page.data,
      path: page.data.info.fullPath,
      url: page.url,
    }))
  )
}

checkLinks().catch((error) => {
  console.error('Failed to validate links.', error)
  process.exitCode = 1
})
