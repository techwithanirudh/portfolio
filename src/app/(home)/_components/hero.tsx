import Image from 'next/image'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { InlineMarkdown } from '@/components/inline-markdown'
import { Section } from '@/components/layout/sections'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { heroIntro } from '@/constants/portfolio/intro'
import { baseOptions } from '@/constants/site'
import heroGradient from '@/public/images/hero-gradient.png'
import { Portrait } from './portrait'

const Hero = () => (
  <Section className='relative isolate flex flex-col overflow-hidden px-6 pt-20 pb-24 sm:px-12 sm:pt-28 sm:pb-32'>
    {/* The soft purple and azure corner blob from the v1 site */}
    <Image
      alt=''
      aria-hidden
      className='fade-in pointer-events-none absolute right-0 bottom-0 -z-10 h-[800px] w-[560px] max-w-none translate-x-1/2 translate-y-1/2 animate-in select-none fill-mode-both opacity-80 duration-1000 ease-out motion-reduce:animate-none sm:h-[860px] sm:w-[720px] sm:translate-x-[38%] sm:translate-y-[42%] md:h-[920px] md:w-[900px] lg:h-[960px] lg:w-[1004px] dark:opacity-100'
      loading='eager'
      sizes='(min-width: 1024px) 1004px, (min-width: 768px) 900px, (min-width: 640px) 720px, 560px'
      src={heroGradient}
    />
    <ViewAnimation delay={0.05}>
      <h1 className='mb-5 text-balance font-medium text-[2.4rem] leading-[1.02] tracking-[-0.04em] sm:mb-6 sm:text-[3.4rem]'>
        Anirudh{' '}
        <span className='mx-[0.04em] inline-block size-[0.8em] translate-y-[0.08em] overflow-hidden rounded-full bg-muted ring-1 ring-border ring-inset'>
          <Portrait viewBox='110 60 730 730' />
        </span>{' '}
        Sriram<span className='text-primary'>.</span>
      </h1>
    </ViewAnimation>
    <ViewAnimation delay={0.1}>
      <p className='max-w-[52ch] text-pretty text-base text-foreground/85 leading-relaxed sm:text-[1.09rem]'>
        <InlineMarkdown
          linkClassName='link-underline'
          previews={false}
          text={heroIntro}
        />
      </p>
    </ViewAnimation>

    <div className='mt-7 flex flex-wrap items-center gap-2.5 sm:mt-9'>
      <ViewAnimation className='flex' delay={0.15}>
        <Link
          className={buttonVariants({ size: 'lg', variant: 'default' })}
          href='/projects'
        >
          Browse Projects
          <Icons.arrowRight className='icon-arrow-button size-4' />
        </Link>
      </ViewAnimation>
      <ViewAnimation className='flex' delay={0.2}>
        <a
          aria-label='GitHub'
          className={buttonVariants({
            className:
              'text-muted-foreground hover:text-foreground [&_svg]:size-5',
            size: 'icon-lg',
            variant: 'ghost',
          })}
          href={baseOptions.githubUrl}
          rel='noreferrer'
          target='_blank'
        >
          <Icons.github />
        </a>
      </ViewAnimation>
    </div>
  </Section>
)

export default Hero
