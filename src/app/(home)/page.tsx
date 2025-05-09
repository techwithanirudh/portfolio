import Hero from '@/app/(home)/_components/hero';
import Separator from '@/components/separator';
import { getSortedByDatePosts } from '@/lib/source';
import CTA from './_components/cta';
import { Customers } from './_components/customers';
import { FAQ } from './_components/faq';
import About from './_components/about';
import Skills from './_components/skills';

import Testimonials from './_components/testimonials';

export default function Home() {
  const posts = getSortedByDatePosts().slice(0, 3);

  return (
    <>
      <Hero posts={posts} />
      <Separator />
      <Customers count={10} />
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
