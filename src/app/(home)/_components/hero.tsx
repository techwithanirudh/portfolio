import Image from 'next/image'
import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { DitherField } from '@/components/shader/dither-field'
import { buttonVariants } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { socials } from '@/constants/navigation'
import { experiences } from '@/constants/portfolio/experiences'
import { cn } from '@/lib/utils'
import { AskDog } from './ask-dog'
import { HeroName } from './hero-name'
import { LocalTime } from './local-time'

const current = experiences.find((experience) => experience.isCurrentEmployer)
const currentRole = current?.positions[0]?.title

const Fact = ({
  children,
  icon,
}: {
  children: React.ReactNode
  icon: React.ReactNode
}) => (
  <li className='flex items-center gap-2.5'>
    <span className='text-muted-foreground [&_svg]:size-4'>{icon}</span>
    {children}
  </li>
)

const Hero = () => (
  <Section className='relative'>
    <div className='relative h-40 overflow-hidden border-border border-b border-dashed sm:h-52'>
      <DitherField className='absolute inset-0 text-primary' />
    </div>

    <div className='flex flex-col gap-5 px-4 pb-8 sm:px-6'>
      <ViewAnimation
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <div className='-mt-12 flex items-end justify-between gap-4 sm:-mt-14'>
          <Image
            alt='Portrait of an1rudh'
            className='size-24 rounded-2xl border border-border bg-background object-cover p-1 shadow-sm sm:size-28'
            height={112}
            priority
            src='/images/profile.png'
            width={112}
          />
          <span className='mb-1 inline-flex items-center gap-2 rounded-full border border-border border-dashed bg-background px-3 py-1 font-mono text-muted-foreground text-xs'>
            <span aria-hidden className='relative flex size-1.5'>
              <span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none' />
              <span className='relative inline-flex size-1.5 rounded-full bg-emerald-500' />
            </span>
            open to work
          </span>
        </div>
      </ViewAnimation>

      <div className='flex flex-col gap-2'>
        <ViewAnimation
          delay={0.05}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <h1 className='font-normal text-4xl tracking-tighter sm:text-5xl'>
            <HeroName />
          </h1>
        </ViewAnimation>
        <ViewAnimation
          delay={0.1}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <p className='font-mono text-muted-foreground text-sm'>
            design engineer <span className='text-primary'>/</span> full-stack
            developer <span className='text-primary'>/</span> student
          </p>
        </ViewAnimation>
      </div>

      <ViewAnimation
        delay={0.15}
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <p className='max-w-xl text-pretty text-base text-muted-foreground leading-relaxed'>
          I design websites and write the code behind them. Self-taught, I
          started with Lego, moved to robots, and now ship AI products with
          Next.js, React, and TypeScript. There is a dog in the corner of this
          page, you can <AskDog /> about me.
        </p>
      </ViewAnimation>

      <ViewAnimation
        delay={0.2}
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <ul className='flex flex-col gap-2 font-mono text-[13px]'>
          {current && (
            <Fact icon={<Icons.work />}>
              {currentRole} @{' '}
              <a
                className='link-underline'
                href={current.companyWebsite}
                rel='noopener noreferrer'
                target='_blank'
              >
                {current.companyName}
              </a>
            </Fact>
          )}
          <Fact icon={<Icons.globe />}>
            India, <LocalTime />
          </Fact>
        </ul>
      </ViewAnimation>

      <ViewAnimation
        delay={0.2}
        initial={{ opacity: 0, translateY: -6 }}
        whileInView={{ opacity: 1, translateY: 0 }}
      >
        <div className='flex flex-wrap items-center gap-2'>
          <Link
            className={cn(
              buttonVariants({ size: 'lg', variant: 'default' }),
              'rounded-full font-mono'
            )}
            data-sound-hover
            href='/work'
          >
            see_work
            <Icons.arrowRight className='icon-arrow-button size-4' />
          </Link>
          <ul className='flex items-center'>
            {socials.map((social) => (
              <li key={social.name}>
                <Link
                  className={cn(
                    buttonVariants({ size: 'icon', variant: 'ghost' }),
                    'rounded-full'
                  )}
                  href={social.url}
                  rel='noopener noreferrer'
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                >
                  {social.icon}
                  <span className='sr-only'>{social.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </ViewAnimation>
    </div>
  </Section>
)

export default Hero
