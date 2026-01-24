import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type ReactElement, ViewTransition } from 'react'
import Balancer from 'react-wrap-balancer'
import BlogProgressBar from '@/components/blog/progress-bar'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/section'
import { Button } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
import { description as homeDescription } from '@/constants/site'
import { createMetadata, getWorkPageImage } from '@/lib/metadata'
import { getWork, getWorkPages, type WorkPage as MDXPage } from '@/lib/source'
import { cn } from '@/lib/utils'

function Header(props: { page: MDXPage }) {
  const { page } = props
  const links: { href: string; label: string; icon: ReactElement }[] = []

  if (page.data.website) {
    links.push({
      href: page.data.website,
      label: 'Visit Website',
      icon: <Icons.globe className='size-4' />,
    })
  }

  if (page.data.github) {
    links.push({
      href: page.data.github,
      label: 'View Source',
      icon: <Icons.gitHub className='size-4' />,
    })
  }

  return (
    <Section className='p-4 lg:p-6'>
      <div
        className={cn(
          'flex flex-col items-start justify-center gap-4 py-8 md:gap-6',
          'sm:items-center sm:rounded-lg sm:border sm:bg-card sm:p-10 sm:shadow-xs'
        )}
      >
        {page.data.image && (
          <ViewTransition
            name={`${page.slugs.join('/')}-image`}
            share='via-blur'
          >
            <BlurImage
              alt={page.data.title ?? 'Work cover image'}
              className='relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-card/50 sm:mx-auto'
              fill
              imageClassName='object-cover'
              sizes='(min-width: 1024px) 1200px, 100vw'
              src={page.data.image}
            />
          </ViewTransition>
        )}
        <div className='flex flex-col gap-2 sm:text-center md:gap-4'>
          <ViewTransition
            name={`${page.slugs.join('/')}-title`}
            share='via-blur'
          >
            <h1 className='typography-hero font-normal text-3xl leading-tight tracking-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl'>
              <Balancer>{page.data.title ?? 'Untitled'}</Balancer>
            </h1>
          </ViewTransition>
          <ViewTransition
            name={`${page.slugs.join('/')}-description`}
            share='via-blur'
          >
            <p className='typography-body mx-auto'>
              <Balancer>{page.data.description ?? ''}</Balancer>
            </p>
          </ViewTransition>
        </div>
        {links.length > 0 && (
          <ViewAnimation
            delay={0.1}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <div className='flex flex-wrap gap-3'>
              {links.map((link) => (
                <Button asChild key={link.href} size='sm' variant='secondary'>
                  <Link
                    href={link.href}
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </Button>
              ))}
            </div>
          </ViewAnimation>
        )}
      </div>
    </Section>
  )
}

export default async function Page(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = getWork([params.slug])

  if (!page) {
    notFound()
  }
  const { body: Mdx, toc } = page.data

  return (
    <>
      <BlogProgressBar />
      <Header page={page} />

      <Section className='h-full' sectionClassName='flex flex-1'>
        <article className='flex min-h-full flex-col'>
          <ViewAnimation
            delay={0.1}
            initial={{ opacity: 0, translateY: -6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <div className='flex flex-1 flex-col gap-4'>
              {toc?.length ? (
                <InlineTOC
                  className='rounded-none border-0 border-border border-b border-dashed'
                  items={toc}
                />
              ) : (
                <div />
              )}
              <div className='prose min-w-0 flex-1 px-4 pb-4'>
                <Mdx
                  components={{
                    ...defaultMdxComponents,
                    File,
                    Files,
                    Folder,
                    Tabs,
                    Tab,
                  }}
                />
              </div>
            </div>
          </ViewAnimation>
        </article>
      </Section>
    </>
  )
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const page = getWork([params.slug])

  if (!page) {
    notFound()
  }

  const title = page.data.title
  const description = page.data.description ?? homeDescription
  const image = getWorkPageImage(page)

  return createMetadata({
    title,
    description,
    openGraph: {
      url: `/work/${page.slugs.join('/')}`,
      images: image.url,
    },
    twitter: {
      images: image.url,
    },
    alternates: {
      canonical: page.url,
    },
  })
}

export function generateStaticParams(): { slug: string | undefined }[] {
  return getWorkPages().map((page) => ({
    slug: page.slugs[0],
  }))
}
