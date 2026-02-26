'use client'

import { type LinkItemType, resolveLinkItems } from 'fumadocs-ui/layouts/shared'
import * as motion from 'motion/react-client'
import Image from 'next/image'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'
import { toast } from 'sonner'
import { Icons } from '@/components/icons/icons'
import { useOiiaMode } from '@/components/oiia'
import { Section } from '@/components/section'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { linkItems } from '@/constants/navigation'
import { baseOptions } from '@/constants/site'
import { cn } from '@/lib/utils'
import heroImage from '../../../../public/images/gradient-noise-purple-azure-light.png'

const Hero = () => {
  const { mode, registerOiiaClick } = useOiiaMode()
  const links = resolveLinkItems({
    links: linkItems,
    githubUrl: baseOptions.githubUrl,
  }) as LinkItemType[]
  const navItems = links.filter((item) =>
    ['nav', 'all'].includes(item.on ?? 'all')
  )

  return (
    <Section className='relative flex flex-col items-center justify-center gap-4 overflow-hidden px-4 py-16 sm:px-16 sm:py-24 md:py-32'>
      <motion.div
        animate={{ opacity: 1, translateY: 0 }}
        className='absolute inset-0 -z-10 h-full w-full'
        initial={{ opacity: 0, translateY: -6 }}
        transition={{
          duration: 0.4,
          scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
        }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1 }}
      >
        <Image
          alt='Hero Background'
          className='pointer-events-none absolute right-0 bottom-0 h-[900px] w-[1004px] max-w-[1004px] translate-x-1/2 translate-y-1/2 select-none opacity-80 dark:opacity-100'
          height={600}
          priority
          src={heroImage}
          width={704}
        />
      </motion.div>
      <ViewAnimation
        delay={0.1}
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <h1
          className={cn(
            'typography-hero font-normal text-3xl leading-tight tracking-tighter',
            'sm:text-center sm:text-4xl sm:leading-tight',
            'md:text-5xl md:leading-tight'
          )}
        >
          {mode === 'oiia' ? (
            <>
              Hi! I'm{' '}
              <button
                aria-pressed={mode === 'oiia'}
                className='inline-flex items-baseline rounded-sm px-1 text-fd-primary transition-colors hover:bg-fd-muted hover:text-fd-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring'
                onClick={() => {
                  registerOiiaClick()
                }}
                type='button'
              >
                OIIA
              </button>
              !
            </>
          ) : (
            <>
              Hi! I'm{' '}
              <button
                aria-pressed={mode === 'oiia'}
                className='inline-flex items-baseline rounded-sm px-1 text-fd-primary transition-colors hover:bg-fd-muted hover:text-fd-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring'
                onClick={() => {
                  const result = registerOiiaClick()
                  if (result.mode === 'default' && result.remaining > 0) {
                    toast(`${result.remaining} clicks remaining`)
                  }
                  if (result.mode === 'oiia') {
                    toast('oiia mode enabled')
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new Event('oiia:spawn'))
                    }
                  }
                }}
                type='button'
              >
                Anirudh
              </button>
              !
            </>
          )}
        </h1>
      </ViewAnimation>
      <ViewAnimation
        delay={0.15}
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <p className='max-w-xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl'>
          <Balancer>
            I'm a design engineer and full-stack developer who blends design and
            development to build beautiful, functional websites.
          </Balancer>
        </p>
      </ViewAnimation>

      <div className='mt-2 flex flex-wrap items-center justify-center gap-4'>
        <ViewAnimation
          delay={0.2}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <Link
            className={cn(
              buttonVariants({
                variant: 'default',
                size: 'lg',
              }),
              'group rounded-full bg-primary hover:bg-primary/90'
            )}
            href='/work'
          >
            Browse Work
            <Icons.arrowRight className='size-5 transition-transform group-hover:-rotate-45' />
          </Link>
        </ViewAnimation>

        <div className='flex items-center space-x-4'>
          {navItems
            .filter((item) => item.type === 'icon')
            .map((item, i) => (
              <ViewAnimation
                className='flex items-center'
                delay={0.1 + i * 0.05}
                duration={0.25}
                initial={{ opacity: 0, translateY: -6, scale: 0.95 }}
                key={i.toString()}
                whileInView={{ opacity: 1, translateY: 0, scale: 1 }}
              >
                <Link
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size: 'icon',
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
