import { getStaticToolName, isStaticToolUIPart, isToolUIPart } from 'ai'
import type { ChatTools, MyUIMessage } from '@/app/api/chat/types'
import { Shimmer } from '@/components/ai-elements/shimmer'
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources'
import { Icons } from '@/components/icons/icons'

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

const toolStatus = (toolName: keyof ChatTools) => {
  switch (toolName) {
    case 'searchDocs':
      return { Icon: Icons.search, label: 'Sniffing the pages' }
    case 'getPageContent':
      return { Icon: Icons.link, label: 'Fetching a page' }
    case 'showContactForm':
      return { Icon: Icons.mail, label: 'Fetching contact form' }
    case 'navigate':
      return { Icon: Icons.arrowUpRight, label: 'Fetching the leash' }
    default:
      return {
        Icon: Icons.wrench,
        label: `Running ${String(toolName)
          .replace(/([A-Z])/g, ' $1')
          .trim()}`,
      }
  }
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
        <Shimmer>Sniffing around...</Shimmer>
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

  if (tool && inProgress && isStaticToolUIPart<ChatTools>(tool)) {
    const { Icon, label } = toolStatus(getStaticToolName(tool))

    return (
      <div className='flex animate-pulse items-center gap-2 text-muted-foreground motion-reduce:animate-none'>
        <Icon aria-hidden className='size-4' />
        <Shimmer>{label}</Shimmer>
      </div>
    )
  }

  return null
}
