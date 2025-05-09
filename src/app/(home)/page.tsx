import Hero from '@/app/(home)/_components/hero';
import Separator from '@/components/separator';
import { getSortedByDatePosts } from '@/lib/source';
import CTA from './_components/cta';
import About from './_components/about';
import Skills from './_components/skills';

export default function Home() {
  const posts = getSortedByDatePosts().slice(0, 3);

  return (
    <>
      <Hero />
      {/* <Separator />
      <Customers count={10} /> */}
      <Separator />
      <About />
      <Separator />
      <Skills />
      {/* <Separator />
      <Testimonials /> */}
      {/* <Separator />
      <FAQ /> */}
      <Separator />
      <CTA />
    </>
  );
}
