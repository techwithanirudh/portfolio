import Link from 'next/link'
import { Icons } from '@/components/icons/icons'
import { HeroSection } from '@/components/layout/sections/hero'

export const Hero = ({
  totalPosts,
  startIndex,
  endIndex,
}: {
  totalPosts: number
  startIndex: number
  endIndex: number
}) => {
  const end = Math.min(endIndex, totalPosts)
  return (
    <HeroSection
      caption={
        <span className='flex items-center justify-between gap-4'>
          <span>
            {totalPosts} posts
            {totalPosts > end - startIndex && ` · ${startIndex + 1}-${end}`}
          </span>
          <Link
            aria-label='Subscribe to RSS feed'
            className='inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary'
            href='/blog/rss.xml'
          >
            <Icons.rss className='size-3.5' />
            RSS
          </Link>
        </span>
      }
      description='Notes on design engineering, full-stack development, AI experiments, and how I built recent projects.'
      title='Blog'
    />
  )
}
