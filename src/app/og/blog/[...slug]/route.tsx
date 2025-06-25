import { generateOGImage } from '@/app/og/blog/[...slug]/og';
import { post } from '@/lib/source';
import { notFound } from 'next/navigation';

async function loadAssets(): Promise<
  { name: string; data: Buffer; weight: 400 | 600; style: 'normal' }[]
> {
  const [
    { base64Font: normal },
    { base64Font: mono },
    { base64Font: semibold },
  ] = await Promise.all([
    import('../fonts/geist-regular-otf.json').then((mod) => mod.default || mod),
    import('../fonts/geistmono-regular-otf.json').then(
      (mod) => mod.default || mod,
    ),
    import('../fonts/geist-semibold-otf.json').then((mod) => mod.default || mod),
  ]);

  return [
    {
      name: 'Geist',
      data: Buffer.from(normal, 'base64'),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Geist Mono',
      data: Buffer.from(mono, 'base64'),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Geist',
      data: Buffer.from(semibold, 'base64'),
      weight: 600 as const,
      style: 'normal' as const,
    },
  ];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const page = post.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const [fonts] = await Promise.all([loadAssets()]);

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    fonts,
  });
};

export function generateStaticParams(): {
  slug: string[];
}[] {
 return post.generateParams().map((page) => ({
    ...page,
    slug: [...page.slug, 'image.png'],
  }));
}
