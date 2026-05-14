import { MarkGithubIcon } from '@primer/octicons-react'
import type { CodeBlockProps } from 'fumadocs-ui/components/codeblock'
import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc'
import {
  getCodeTitle,
  getGitHubFileContent,
  parseGitHubURL,
  resolveLanguage,
  sliceLines,
} from '@/lib/github-code'

interface GitHubCodeProps {
  allowCopy?: CodeBlockProps['allowCopy']
  endLine?: number
  icon?: CodeBlockProps['icon']
  keepBackground?: CodeBlockProps['keepBackground']
  language?: string
  startLine?: number
  title?: string
  url: string
}

function GitHubSourceLink({ sourceUrl }: { sourceUrl: string }) {
  return (
    <div className='absolute top-[7px] right-9 z-10 bg-(--shiki-light-bg) dark:bg-(--shiki-dark-bg)'>
      <a
        aria-label='View source on GitHub'
        className='inline-flex items-center justify-center rounded-md p-1 font-medium text-fd-muted-foreground text-sm transition-colors duration-100 hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50 data-checked:text-fd-accent-foreground [&_svg]:size-4'
        href={sourceUrl}
        rel='noopener noreferrer'
        target='_blank'
      >
        <MarkGithubIcon className='size-4' />
      </a>
    </div>
  )
}

export async function GitHubCode({
  url,
  language,
  startLine,
  endLine,
  title,
  allowCopy = true,
  keepBackground = false,
  icon,
}: GitHubCodeProps) {
  try {
    const resolved = parseGitHubURL(url)
    const resolvedStartLine = startLine ?? resolved.lineRange.startLine
    const resolvedEndLine = endLine ?? resolved.lineRange.endLine
    const text = await getGitHubFileContent(resolved)
    const snippet = sliceLines(text, resolvedStartLine, resolvedEndLine)
    const codeTitle =
      title ?? getCodeTitle(resolved.path, resolvedStartLine, resolvedEndLine)
    const lang = language ?? resolveLanguage(resolved.path)

    return (
      <div className='relative min-w-0 [&_figcaption]:pr-8'>
        <GitHubSourceLink sourceUrl={resolved.source} />
        <ServerCodeBlock
          code={snippet}
          codeblock={{
            allowCopy,
            icon,
            keepBackground,
            lang,
            title: codeTitle,
            viewportProps: {
              className: 'max-w-full',
            },
          }}
          lang={lang}
        />
      </div>
    )
  } catch (error) {
    return (
      <p>
        Unable to load source snippet from <code>{url}</code>
        {process.env.NODE_ENV !== 'production' &&
          error instanceof Error &&
          ` (${error.message})`}
        .
      </p>
    )
  }
}

export { GitHubCode as GitHubSourceCode }
