import { type NextRequest, NextResponse } from 'next/server';
import { getWorkLLMText } from '@/lib/get-llm-text';
import { workSource } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(
  _req: NextRequest,
  { params }: RouteContext<'/work.mdx/[[...slug]]'>,
) {
  const slug = (await params).slug;
  const page = workSource.getPage(slug);
  if (!page) notFound();

  return new NextResponse(await getWorkLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return workSource.generateParams();
}