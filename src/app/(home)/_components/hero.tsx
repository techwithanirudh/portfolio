import { type LinkItemType, resolveLinkItems } from 'fumadocs-ui/layouts/shared'
import * as motion from 'motion/react-client'
import Image from 'next/image'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/section'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { linkItems } from '@/constants/navigation'
import { baseOptions } from '@/constants/site'
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
    <Section className='relative flex flex-col items-center justify-center gap-4 overflow-hidden px-4 py-24 sm:px-16 sm:py-32 md:py-40'>
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
          className='pointer-events-none absolute right-0 bottom-0 h-[800px] w-[560px] max-w-none translate-x-1/2 translate-y-1/2 select-none opacity-80 sm:h-[860px] sm:w-[720px] sm:max-w-[720px] md:h-[920px] md:w-[900px] md:max-w-[900px] lg:h-[960px] lg:w-[1004px] lg:max-w-[1004px] dark:opacity-100'
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
            'typography-hero text-balance text-center font-normal text-4xl leading-tight tracking-tighter',
            'md:text-5xl'
          )}
        >
          Hi! I'm Anirudh!
        </h1>
      </ViewAnimation>
      <ViewAnimation
        delay={0.15}
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <p className='max-w-sm text-pretty text-center text-base text-muted-foreground leading-relaxed tracking-tight sm:max-w-xl sm:text-lg md:text-xl'>
          I'm a design engineer and full-stack developer who blends design and
          development to build beautiful, functional websites.
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
              'rounded-full bg-primary hover:bg-primary/90'
            )}
            href='/work'
          >
            Browse Work
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
