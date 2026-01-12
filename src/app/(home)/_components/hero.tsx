import { type LinkItemType, resolveLinkItems } from 'fumadocs-ui/layouts/shared'
import * as motion from 'motion/react-client'
import Image from 'next/image'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'
import { baseOptions, linkItems } from '@/app/layout.shared'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/section'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'
import heroImage from '../../../../public/images/gradient-noise-purple-azure-light.png'

const Hero = () => {
  const links = resolveLinkItems({
    links: linkItems,
    githubUrl: baseOptions.githubUrl,
  }) as LinkItemType[]
  const navItems = links.filter((item) =>
    ['nav', 'all'].includes(item.on ?? 'all')
  )

  return (
    <Section className='relative flex flex-col items-center justify-center gap-6 overflow-hidden px-4 py-16 sm:px-16 sm:py-24 md:py-32'>
      <motion.div
        animate={{ opacity: 1, translateY: 0 }}
        className='absolute inset-0 -z-10 h-full w-full'
        initial={{ opacity: 0, translateY: -8 }}
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
        delay={0.2}
        initial={{ opacity: 0, translateY: -8 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <h1
          className={cn(
            'typography-hero font-bold text-3xl leading-tight tracking-tight',
            'sm:text-center sm:text-4xl sm:leading-tight',
            'md:text-5xl md:leading-tight'
          )}
        >
          Hi! I'm Anirudh!
        </h1>
      </ViewAnimation>
      <ViewAnimation
        delay={0.4}
        initial={{ opacity: 0, translateY: -8 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <p className='typography-body text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl'>
          <Balancer>
            I'm a full-stack developer who builds web apps and AI tools. I
            mostly work with Next.js, React, and TypeScript.
          </Balancer>
        </p>
      </ViewAnimation>

      <div className='flex flex-wrap items-center justify-center gap-4'>
        <ViewAnimation
          delay={0.6}
          initial={{ opacity: 0, translateY: -8 }}
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
                delay={0.7 + i * 0.1}
                initial={{ opacity: 0, translateY: -8, scale: 0.8 }}
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
