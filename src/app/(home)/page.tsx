import Hero from '@/app/(home)/_components/hero';
import Separator from '@/components/separator';
import { Wrapper } from '@/components/wrapper';
import { getSortedByDatePosts } from '@/lib/source';
import About from './_components/about';
import CTA from './_components/cta';
import { Customers } from './_components/customers';
import Skills from './_components/skills';
import Testimonials from './_components/testimonials';

export default function Home() {
  const posts = getSortedByDatePosts().slice(0, 3);

  return (
    <Wrapper lenis={{}}>
      <Hero />
      <Separator />
      <Customers count={10} />
      <Separator />
      <About />
      <Separator />
      <Skills />
      <Separator />
      <Testimonials />
      {/* <Separator />
      <FAQ /> */}
      <Separator />
      <CTA />
    </Wrapper>
  );
}
