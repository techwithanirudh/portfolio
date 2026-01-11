import Hero from '@/app/(home)/_components/hero'
import Separator from '@/components/separator'
import { Wrapper } from '@/components/wrapper'
import About from './_components/about'
import CTA from './_components/cta'
import { Logos } from './_components/logos'
import Skills from './_components/skills'
import Testimonials from './_components/testimonials'

const testimonials = [
  {
    title: 'Transformed our workflow',
    description:
      'SaasCN has completely revolutionized how we handle our business processes. The automation features alone have saved us countless hours.',
    author: {
      name: 'Hayden Bleasel',
      image: 'https://github.com/haydenbleasel.png',
    },
  },
  {
    title: 'Enterprise-grade solution',
    description:
      'The platform offers enterprise-level features while maintaining an intuitive interface. Perfect for scaling organizations.',
    author: {
      name: 'Lee Robinson',
      image: 'https://github.com/leerob.png',
    },
  },
  {
    title: 'Exceptional integration',
    description:
      'The ease of integration with our existing tools was impressive. It fits perfectly into our tech stack.',
    author: {
      name: 'shadcn',
      image: 'https://github.com/shadcn.png',
    },
  },
  {
    title: 'Outstanding support',
    description:
      'Their customer support team goes above and beyond. Any questions we had were answered promptly and thoroughly.',
    author: {
      name: 'Pontus Abrahamsson',
      image: 'https://github.com/pontusab.png',
    },
  },
]

export default function Home() {
  return (
    <Wrapper lenis={{}}>
      <Hero />
      <Separator />
      <Logos />
      <Separator />
      <About />
      <Separator />
      <Skills />
      <Separator />
      <Testimonials testimonials={testimonials} />
      {/* <Separator />
      <FAQ /> */}
      <Separator />
      <CTA />
    </Wrapper>
  )
}
