import Image from 'next/image'
import Marquee from 'react-fast-marquee'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import ClaudeDark from '@/public/images/logos/dark/claude.svg'
import NeonDark from '@/public/images/logos/dark/neon.svg'
import NextjsDark from '@/public/images/logos/dark/nextjs.svg'
import OpenAIDark from '@/public/images/logos/dark/openai.svg'
import VercelDark from '@/public/images/logos/dark/vercel.svg'
import ClaudeLight from '@/public/images/logos/light/claude.svg'
import NeonLight from '@/public/images/logos/light/neon.svg'
import NextjsLight from '@/public/images/logos/light/nextjs.svg'
import OpenAILight from '@/public/images/logos/light/openai.svg'
import VercelLight from '@/public/images/logos/light/vercel.svg'

const logos = [
  {
    name: 'Vercel',
    light: VercelLight,
    dark: VercelDark,
  },
  {
    name: 'OpenAI',
    light: OpenAILight,
    dark: OpenAIDark,
  },
  {
    name: 'Claude',
    light: ClaudeLight,
    dark: ClaudeDark,
  },
  {
    name: 'Next.js',
    light: NextjsLight,
    dark: NextjsDark,
  },
  {
    name: 'Neon',
    light: NeonLight,
    dark: NeonDark,
  },
]

export const Logos = () => (
  <Section className='relative flex flex-col items-center justify-between gap-8 p-6 py-8 sm:flex-row sm:gap-16 md:py-10'>
    <ViewAnimation
      className='px-4'
      initial={{ opacity: 0, translateY: -8 }}
      whileInView={{ opacity: 1, translateY: 0 }}
    >
      <p className='text-base text-muted-foreground'>
        My projects have been used by the world&apos;s most innovative companies
      </p>
    </ViewAnimation>

    <div className='relative select-none md:max-w-[50%]'>
      <Marquee autoFill>
        {logos.map((logo, index) => (
          <ViewAnimation
            animate={{ opacity: 1 }}
            delay={0.4 + index * 0.1}
            initial={{ opacity: 0, filter: 'blur(0px)' }}
            key={logo.name}
          >
            <Image
              alt=''
              className='mx-12 h-10 w-20 object-contain opacity-50 dark:hidden'
              height={40}
              src={logo.light}
              width={80}
            />
            <Image
              alt=''
              className='mx-12 hidden h-10 w-20 object-contain opacity-50 dark:block'
              height={40}
              src={logo.dark}
              width={80}
            />
          </ViewAnimation>
        ))}
      </Marquee>
      <div className='absolute top-0 bottom-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent' />
      <div className='absolute top-0 right-0 bottom-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent' />
    </div>
  </Section>
)
