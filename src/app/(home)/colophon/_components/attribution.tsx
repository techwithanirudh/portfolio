import { Icons } from '@/components/icons/icons'
import { PreviewLink } from '@/components/preview-link'
import { attributions } from '@/constants/portfolio/colophon'

const wwwPrefix = /^www\./
const hostname = (url: string) => new URL(url).hostname.replace(wwwPrefix, '')

export const Attribution = () => (
  <div>
    <p className='border-line border-b p-4 text-muted-foreground text-sm'>
      Code and design ideas I borrowed, learned from or just stared at for too
      long. Some of the layout ideas also come from{' '}
      <PreviewLink className='link-underline' href='https://godly.website'>
        Godly
      </PreviewLink>
      .
    </p>
    <div className='overflow-hidden'>
      <ul className='-mr-px -mb-px grid grid-cols-2 bg-dashed lg:grid-cols-3 [&>*]:border-line [&>*]:border-r [&>*]:border-b'>
        {attributions.map((creator) => (
          <li className='flex' key={creator.name}>
            <PreviewLink
              className='group flex w-full items-center gap-3 bg-background px-4 py-3 transition-colors hover:bg-card'
              data-sound-hover
              href={creator.url}
            >
              <span className='flex min-w-0 flex-1 flex-col'>
                <span className='truncate text-foreground text-sm'>
                  {creator.name}
                </span>
                <span className='truncate font-mono text-muted-foreground text-xs'>
                  {hostname(creator.url)}
                </span>
              </span>
              <Icons.arrowUpRight className='size-3.5 shrink-0 text-muted-foreground transition-[rotate,scale,color] duration-300 group-hover:rotate-45 group-hover:scale-110 group-hover:text-primary' />
            </PreviewLink>
          </li>
        ))}
      </ul>
    </div>
  </div>
)
