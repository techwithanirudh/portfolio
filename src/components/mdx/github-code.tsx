import type { CodeBlockProps } from 'fumadocs-ui/components/codeblock'
import { GitHubCodeBlockClient } from '@/components/mdx/github-code.client'
import {
  getCodeTitle,
  getGitHubFileContent,
  parseGitHubURL,
  resolveLanguage,
  sliceLines,
} from '@/lib/github-code'

interface GitHubCodeProps {
  url: string
  language?: string
  startLine?: number
  endLine?: number
  title?: string
  allowCopy?: CodeBlockProps['allowCopy']
  keepBackground?: CodeBlockProps['keepBackground']
  icon?: CodeBlockProps['icon']
}

export async function GitHubCode({
  url,
  language,
  startLine,
  endLine,
  title,
  allowCopy = true,
  keepBackground = true,
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
      <div className='min-w-0'>
        <GitHubCodeBlockClient
          allowCopy={allowCopy}
          code={snippet}
          icon={icon}
          keepBackground={keepBackground}
          lang={lang}
          sourceUrl={resolved.source}
          title={codeTitle}
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
