import { Icons } from '@/components/icons/icons'
import { HeroSection } from '@/components/layout/sections/hero'
import { buttonVariants } from '@/components/ui/button'

export const Hero = ({
  description,
  pageCount,
  pageIndex,
}: {
  description: string
  pageCount: number
  pageIndex: number
}) => (
  <HeroSection
    action={
      <a
        aria-label='RSS feed'
        className={buttonVariants({ size: 'sm', variant: 'outline' })}
        href='/blog/rss.xml'
      >
        <Icons.rss />
        RSS
      </a>
    }
    caption={pageIndex > 0 ? `Page ${pageIndex + 1} of ${pageCount}` : null}
    description={description}
    title='Blog'
  />
)
