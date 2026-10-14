import Image from 'next/image'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import {
  Panel,
  PanelAction,
  PanelHeader,
  PanelTitle,
} from '@/components/layout/panel'
import { ViewAnimation } from '@/components/view-animation'
import type { WorkPage } from '@/lib/source'

export default function WorkPreview({ works }: { works: WorkPage[] }) {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>work</PanelTitle>
        <PanelAction>
          <Link
            className='transition-colors hover:text-foreground'
            href='/work'
          >
            view_all
            <Icons.arrowRight className='icon-arrow-button ml-1 inline size-3' />
          </Link>
        </PanelAction>
      </PanelHeader>
      <ul className='divide-y divide-dashed divide-line'>
        {works.map((work, index) => (
          <ViewAnimation
            blur={false}
            delay={0.05 * index}
            initial={{ opacity: 0, translateY: -6 }}
            key={work.url}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <li>
              <Link
                className='group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-card'
                data-sound-hover
                href={work.url}
              >
                {work.data.image ? (
                  <Image
                    alt=''
                    className='h-14 w-24 shrink-0 rounded-md border border-border object-cover'
                    height={56}
                    sizes='96px'
                    src={work.data.image}
                    width={96}
                  />
                ) : (
                  <span className='h-14 w-24 shrink-0 rounded-md bg-muted' />
                )}
                <div className='min-w-0 flex-1'>
                  <h3 className='font-medium text-sm tracking-tight'>
                    {work.data.title ?? 'Untitled'}
                  </h3>
                  <p className='line-clamp-2 text-[13px] text-muted-foreground'>
                    {work.data.description}
                  </p>
                </div>
                <Icons.arrowRight className='size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground' />
              </Link>
            </li>
          </ViewAnimation>
        ))}
      </ul>
    </Panel>
  )
}
