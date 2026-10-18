import { getStaticToolName, isStaticToolUIPart, isToolUIPart } from 'ai'
import { Shimmer } from '@/components/ai-elements/shimmer'
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources'
import { Icons } from '@/components/icons/icons'
import type { SvgIcon } from '@/components/icons/utils'
import type { ChatTools, MyUIMessage } from '@/lib/ai/chat/types'

interface MessageMetadataProps {
  inProgress: boolean
  parts: MyUIMessage['parts']
}

export const MessagePending = () => (
  <div className='flex items-center gap-2'>
    <Icons.pawPrint
      aria-hidden
      className='size-4 animate-spin text-primary motion-reduce:animate-none'
    />
    <span className='sr-only'>Simba is thinking</span>
  </div>
)

type ToolWithOwnStatus = 'navigate' | 'renderPortfolio'

const hasOwnStatus = (
  toolName: keyof ChatTools
): toolName is ToolWithOwnStatus =>
  toolName === 'navigate' || toolName === 'renderPortfolio'

const toolStatus: Record<
  Exclude<keyof ChatTools, ToolWithOwnStatus>,
  { Icon: SvgIcon; label: string }
> = {
  getPageContent: { Icon: Icons.link, label: 'Fetching a page' },
  searchDocs: { Icon: Icons.search, label: 'Sniffing the pages' },
  showContactForm: { Icon: Icons.mail, label: 'Fetching contact form' },
}

export const MessageMetadata = ({
  parts,
  inProgress,
}: MessageMetadataProps) => {
  const lastPart = parts
    .filter((part) => part.type === 'text' || isToolUIPart(part))
    .at(-1)

  const reasoning = parts.at(-1)?.type === 'reasoning'

  if (!lastPart) {
    if (!inProgress) {
      return null
    }
    return reasoning ? (
      <div className='flex items-center gap-2 text-muted-foreground'>
        <Icons.brain aria-hidden className='size-4' />
        <Shimmer>Sniffing around…</Shimmer>
      </div>
    ) : (
      <MessagePending />
    )
  }

  const tool = isToolUIPart(lastPart) ? lastPart : null

  const sources = Array.from(
    new Map(
      parts
        .filter((part) => part.type === 'source-url')
        .map((part) => [part.url, part])
    ).values()
  )

  if (sources.length > 0 && !(tool && inProgress)) {
    return (
      <Sources>
        <SourcesTrigger count={sources.length} />
        <SourcesContent>
          <ul className='flex flex-col gap-2 pt-3'>
            {sources.map((source) => (
              <li className='ml-4.5 list-disc pl-1' key={source.url}>
                <Source href={source.url} title={source.url}>
                  {source.title ?? source.url}
                </Source>
              </li>
            ))}
          </ul>
        </SourcesContent>
      </Sources>
    )
  }

  const toolName =
    tool && inProgress && isStaticToolUIPart<ChatTools>(tool)
      ? getStaticToolName(tool)
      : null

  if (toolName && !hasOwnStatus(toolName)) {
    const { Icon, label } = toolStatus[toolName]

    return (
      <div className='flex animate-pulse items-center gap-2 text-muted-foreground motion-reduce:animate-none'>
        <Icon aria-hidden className='size-4' />
        <Shimmer>{label}</Shimmer>
      </div>
    )
  }

  return null
}
