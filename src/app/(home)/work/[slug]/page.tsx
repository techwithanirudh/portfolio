import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type ReactElement, ViewTransition } from 'react'
import Balancer from 'react-wrap-balancer'
import { Share } from '@/app/(home)/(blog)/blog/[slug]/page.client'
import { description as homeDescription } from '@/app/layout.shared'
import { BlurImage } from '@/components/blur-image'
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/section'
import { Button } from '@/components/ui/button'
import { ViewAnimation } from '@/components/view-animation'
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
          'sm:items-center sm:rounded-lg sm:border sm:bg-card sm:px-8 sm:py-20 sm:shadow-xs'
        )}
      >
        <div className='flex flex-col gap-2 sm:text-center md:gap-4'>
          <ViewTransition name={page.slugs.join('/')}>
            <ViewAnimation
              delay={0.2}
              initial={{ opacity: 0, translateY: -8 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <h1 className='max-w-4xl font-normal text-3xl leading-tight tracking-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl'>
                <Balancer>{page.data.title ?? 'Untitled'}</Balancer>
              </h1>
            </ViewAnimation>
            <ViewAnimation
              delay={0.4}
              initial={{ opacity: 0, translateY: -8 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <p className='mx-auto max-w-4xl'>
                <Balancer>{page.data.description ?? ''}</Balancer>
              </p>
            </ViewAnimation>
          </ViewTransition>
        </div>
        {page.data.image && (
          <ViewAnimation
            delay={0.6}
            initial={{ opacity: 0, translateY: -8 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <div className='aspect-video w-full overflow-hidden rounded-lg border border-border border-dashed bg-card/50'>
              <BlurImage
                alt={page.data.title ?? 'Work cover image'}
                className='h-full w-full'
                height={630}
                imageClassName='h-full w-full object-cover'
                src={page.data.image}
                width={1200}
              />
            </div>
          </ViewAnimation>
        )}
        {links.length > 0 && (
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
  const { body: Mdx, toc, lastModified } = page.data

  const lastUpdate = lastModified ? new Date(lastModified) : undefined

  return (
    <>
      <Header page={page} />

      <Section className='h-full' sectionClassName='flex flex-1'>
        <article className='flex min-h-full flex-col lg:flex-row'>
          <div className='flex flex-1 flex-col gap-4'>
            <InlineTOC
              className='rounded-none border-0 border-border border-b border-dashed'
              items={toc}
            />
            <div className='prose min-w-0 flex-1 px-4'>
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
          <div className='flex flex-col gap-4 p-4 text-sm lg:sticky lg:top-[4rem] lg:h-[calc(100vh-4rem)] lg:w-[250px] lg:self-start lg:overflow-y-auto lg:border-border lg:border-l lg:border-dashed'>
            <div>
              <p className='mb-1 text-fd-muted-foreground text-sm'>
                Created At
              </p>
              <p className='font-medium'>
                {new Date(page.data.date).toDateString()}
              </p>
            </div>
            {page.data.website && (
              <div>
                <p className='mb-1 text-fd-muted-foreground text-sm'>Website</p>
                <Link
                  className='font-medium text-primary underline-offset-4 hover:underline'
                  href={page.data.website}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  {page.data.website}
                </Link>
              </div>
            )}
            {page.data.github && (
              <div>
                <p className='mb-1 text-fd-muted-foreground text-sm'>GitHub</p>
                <Link
                  className='font-medium text-primary underline-offset-4 hover:underline'
                  href={page.data.github}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  {page.data.github}
                </Link>
              </div>
            )}
            {lastUpdate && (
              <div>
                <p className='mb-1 text-fd-muted-foreground text-sm'>
                  Updated At
                </p>
                <p className='font-medium'>{lastUpdate.toDateString()}</p>
              </div>
            )}
            <Share label='Share Work' url={page.url} />
          </div>
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
