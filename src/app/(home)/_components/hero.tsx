import { getImageProps } from 'next/image'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { InlineMarkdown } from '@/components/inline-markdown'
import { Section } from '@/components/layout/sections'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { heroIntro } from '@/constants/portfolio/intro'
import { baseOptions } from '@/constants/site'
import heroGradient640 from '@/public/images/hero-gradient/640.avif'
import heroGradient750 from '@/public/images/hero-gradient/750.avif'
import heroGradient828 from '@/public/images/hero-gradient/828.avif'
import heroGradient1080 from '@/public/images/hero-gradient/1080.avif'
import heroGradient1200 from '@/public/images/hero-gradient/1200.avif'
import heroGradient1408 from '@/public/images/hero-gradient/1408.avif'
import heroGradient from '@/public/images/hero-gradient.png'
import { PortraitChip } from './portrait'

const gradientSizes =
  '(min-width: 1024px) 1004px, (min-width: 768px) 900px, (min-width: 640px) 720px, 560px'

// The blob's film grain is most of its weight, and the optimizer only speaks
// WebP here (359KB at the phone size). These AVIFs (sharp, quality 80, at the
// optimizer's widths up to the PNG's own 1408) keep as much grain at 41% less,
// so re-export them from the PNG if it ever changes. WebP stays as the
// fallback. Turbopack reads no size from AVIF imports, hence the widths
const gradientAvifSet = (
  [
    [heroGradient640, 640],
    [heroGradient750, 750],
    [heroGradient828, 828],
    [heroGradient1080, 1080],
    [heroGradient1200, 1200],
    [heroGradient1408, 1408],
  ] as const
)
  .map(([image, width]) => `${image.src} ${width}w`)
  .join(', ')

const { props: gradientProps } = getImageProps({
  alt: '',
  loading: 'eager',
  sizes: gradientSizes,
  src: heroGradient,
})

const Hero = () => (
  <Section className='relative isolate flex flex-col overflow-hidden px-6 pt-20 pb-24 sm:px-12 sm:pt-28 sm:pb-32'>
    {/* The soft purple and azure corner blob from the v1 site */}
    <picture>
      <source
        sizes={gradientSizes}
        srcSet={gradientAvifSet}
        type='image/avif'
      />
      <img
        {...gradientProps}
        alt=''
        aria-hidden
        className='fade-in pointer-events-none absolute right-0 bottom-0 -z-10 h-[800px] w-[560px] max-w-none translate-x-1/2 translate-y-1/2 animate-in select-none fill-mode-both opacity-80 duration-1000 ease-out motion-reduce:animate-none sm:h-[860px] sm:w-[720px] sm:translate-x-[38%] sm:translate-y-[42%] md:h-[920px] md:w-[900px] lg:h-[960px] lg:w-[1004px] dark:opacity-100'
        height={heroGradient.height}
        width={heroGradient.width}
      />
    </picture>
    <ViewAnimation delay={0.05}>
      <h1 className='mb-5 text-balance font-medium text-[2.4rem] leading-[1.02] tracking-[-0.04em] sm:mb-6 sm:text-[3.4rem]'>
        Anirudh <PortraitChip /> Sriram<span className='text-primary'>.</span>
      </h1>
    </ViewAnimation>
    <ViewAnimation delay={0.1}>
      <p className='max-w-[52ch] text-pretty text-base text-foreground/85 leading-relaxed sm:text-[1.09rem]'>
        <InlineMarkdown linkClassName='link-underline' text={heroIntro} />
      </p>
    </ViewAnimation>

    <div className='mt-7 flex flex-wrap items-center gap-2.5 sm:mt-9'>
      <ViewAnimation className='flex' delay={0.15}>
        <Link
          className={buttonVariants({ size: 'lg', variant: 'default' })}
          href='/projects'
        >
          Browse projects
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
