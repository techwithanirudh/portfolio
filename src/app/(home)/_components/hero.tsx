import { type LinkItemType, resolveLinkItems } from 'fumadocs-ui/layouts/shared'
import * as motion from 'motion/react-client'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { HeroGradient } from '@/components/shader/hero-gradient'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { linkItems } from '@/constants/navigation'
import { baseOptions } from '@/constants/site'
import { cn } from '@/lib/utils'

const Hero = () => {
  const links = resolveLinkItems({
    githubUrl: baseOptions.githubUrl,
    links: linkItems,
  }) as LinkItemType[]
  const navItems = links.filter((item) =>
    ['nav', 'all'].includes(item.on ?? 'all')
  )

  return (
    <Section className='relative flex flex-col items-center justify-center gap-4 overflow-hidden px-4 py-24 sm:px-16 sm:py-32 md:py-40'>
      <motion.div
        animate={{ opacity: 1, translateY: 0 }}
        className='absolute inset-0 -z-10 h-full w-full'
        initial={{ opacity: 0, translateY: -6 }}
        transition={{
          duration: 0.4,
          scale: { bounce: 0.5, type: 'spring', visualDuration: 0.4 },
        }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1 }}
      >
        <HeroGradient />
      </motion.div>
      <ViewAnimation delay={0.1}>
        <h1
          className={cn(
            'typography-hero text-balance text-center font-normal text-4xl leading-tight tracking-tighter',
            'md:text-5xl'
          )}
        >
          Hi! I'm Anirudh!
        </h1>
      </ViewAnimation>
      <ViewAnimation delay={0.15}>
        <p className='max-w-sm text-pretty text-center text-base text-muted-foreground leading-relaxed tracking-tight sm:max-w-xl sm:text-lg md:text-xl'>
          I'm a design engineer and full-stack developer who designs websites
          and writes the code behind them.
        </p>
      </ViewAnimation>

      <div className='mt-2 flex flex-wrap items-center justify-center gap-4'>
        <ViewAnimation delay={0.2}>
          <Link
            className={cn(
              buttonVariants({
                size: 'lg',
                variant: 'default',
              }),
              'rounded-full bg-primary hover:bg-primary/90'
            )}
            href='/projects'
          >
            Browse Projects
            <Icons.arrowRight className='icon-arrow-button size-5' />
          </Link>
        </ViewAnimation>

        <div className='flex items-center space-x-4'>
          {navItems
            .filter((item) => item.type === 'icon')
            .map((item, i) => (
              <ViewAnimation
                className='flex items-center'
                delay={0.1 + i * 0.05}
                key={i.toString()}
              >
                <Link
                  className={cn(
                    buttonVariants({
                      size: 'icon',
                      variant: 'ghost',
                    }),
                    'rounded-full'
                  )}
                  href={item.url}
                >
                  {item.icon}
                  <span className='sr-only'>{item.text}</span>
                </Link>
              </ViewAnimation>
            ))}
        </div>
      </div>
    </Section>
  )
}

export default Hero
