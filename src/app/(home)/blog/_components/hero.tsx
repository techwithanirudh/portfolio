import { Icons } from '@/components/icons/icons'
import { HeroSection } from '@/components/layout/sections/hero'
import { buttonVariants } from '@/components/ui/button-variants'
import { pages } from '@/constants/pages'

export const Hero = ({
  pageCount,
  pageIndex,
}: {
  pageCount: number
  pageIndex: number
}) => (
  <HeroSection
    action={
      <a
        aria-label='RSS feed'
        className={buttonVariants({
          className:
            'relative text-muted-foreground after:absolute after:-inset-0.5 hover:text-foreground',
          size: 'icon',
          variant: 'ghost',
        })}
        href='/blog/rss.xml'
        rel='noopener'
        target='_blank'
      >
        <Icons.rss className='size-5' />
      </a>
    }
    caption={pageIndex > 0 ? `Page ${pageIndex + 1} of ${pageCount}` : null}
    description={pages.blog.description}
    title={pages.blog.title}
  />
)
