import type { ReactNode } from 'react'
import { PostComments } from '@/app/(home)/blog/[slug]/page.client'
import { Section } from '@/components/layout/sections'
import { SectionBody } from '@/components/layout/sections/body'
import { Prose, proseMeasure } from '@/components/prose'
import { cn } from '@/lib/utils'

interface MdxLayoutProps {
  children: ReactNode
  comments?: boolean
  slug: string
  title: string
}

interface MdxContentProps {
  beforeComments?: ReactNode
  children: ReactNode
  className?: string
  comments?: boolean
  commentsClassName?: string
  proseClassName?: string
  slug?: string
}

export const MdxContent = ({
  children,
  beforeComments,
  comments,
  slug,
  className,
  proseClassName,
  commentsClassName,
}: MdxContentProps) => (
  <div className={cn('flex min-w-0 flex-1 flex-col gap-4', className)}>
    <Prose
      className={cn(
        'min-w-0 flex-1 px-4 text-fd-foreground/90',
        proseMeasure,
        proseClassName
      )}
    >
      {children}
    </Prose>
    {beforeComments}
    {comments && slug ? (
      <PostComments
        className={cn(
          '[&_form>div]:!rounded-none rounded-none border-0 border-border border-t border-b border-dashed lg:border-b-0',
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
          <MdxContent comments={comments} slug={slug}>
            {children}
          </MdxContent>
        </article>
      </SectionBody>
    </>
  )
}
