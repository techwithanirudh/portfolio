import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import type { ComponentProps, ReactNode } from 'react'
import { PostComments } from '@/app/(home)/blog/[slug]/page.client'
import { Section } from '@/components/section'
import { SectionBody } from '@/components/section-body'
import { cn } from '@/lib/utils'

interface MdxLayoutProps {
  children: ReactNode
  title: string
  toc?: ComponentProps<typeof InlineTOC>['items']
  comments?: boolean
  slug: string
}

interface InlineTocBlockProps {
  items?: ComponentProps<typeof InlineTOC>['items']
  className?: string
}

export const InlineTocBlock = ({ items, className }: InlineTocBlockProps) =>
  items?.length ? (
    <InlineTOC
      className={cn(
        'rounded-none border-0 border-border border-b border-dashed',
        className
      )}
      items={items}
    />
  ) : (
    <div className='py-2' />
  )

interface MdxContentProps {
  children: ReactNode
  toc?: ComponentProps<typeof InlineTOC>['items']
  comments?: boolean
  slug?: string
  className?: string
  proseClassName?: string
  commentsClassName?: string
}

export const MdxContent = ({
  children,
  toc,
  comments,
  slug,
  className,
  proseClassName,
  commentsClassName,
}: MdxContentProps) => (
  <div className={cn('flex flex-1 flex-col gap-4', className)}>
    <InlineTocBlock items={toc} />
    <div className={cn('prose min-w-0 flex-1 px-4', proseClassName)}>
      {children}
    </div>
    {comments && slug ? (
      <PostComments
        className={cn(
          '[&_form>div]:!rounded-none rounded-none border-0 border-border border-t border-dashed',
          commentsClassName
        )}
        slug={slug}
      />
    ) : (
      <div className='py-2' />
    )}
  </div>
)

export default function MdxLayout({
  children,
  title,
  toc,
  comments,
  slug,
}: MdxLayoutProps): ReactNode {
  return (
    <>
      <Section className='p-4 lg:p-6'>
        <h1 className='typography-hero mx-auto text-center font-normal text-3xl leading-tight tracking-tighter md:text-5xl'>
          {title}
        </h1>
      </Section>

      <SectionBody>
        <article className='flex min-h-full flex-col lg:flex-row'>
          <MdxContent comments={comments} slug={slug} toc={toc}>
            {children}
          </MdxContent>
        </article>
      </SectionBody>
    </>
  )
}
