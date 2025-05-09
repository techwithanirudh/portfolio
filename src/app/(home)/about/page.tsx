import Separator from '@/components/separator';
import { getSortedByDatePosts } from '@/lib/source';
import CTA from '../_components/cta';
import Hero from './_components/hero';
import Updates from './_components/updates';

export default function AboutPage() {
  const posts = getSortedByDatePosts();

  return (
    <>
      <Hero />
      <Separator />
      <Updates posts={posts} />
      <CTA />
    </>
  );
}
