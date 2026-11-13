import { Icons } from '@/components/icons/icons'
import { HeroSection } from '@/components/layout/sections/hero'
import { buttonVariants } from '@/components/ui/button'
import { pages } from '@/constants/pages'

export const Hero = () => (
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
    description={pages.blog.description}
    title={pages.blog.title}
  />
)
