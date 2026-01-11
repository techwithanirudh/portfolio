import { HeroSection } from '@/components/sections/hero'

const CurrentPostsCount = ({
  startIndex,
  endIndex,
  totalPosts = 0,
}: {
  startIndex: number
  endIndex: number
  totalPosts?: number
}) => {
  const start = startIndex + 1
  const end = endIndex < totalPosts ? endIndex : totalPosts
  if (start === end) {
    return <span>({start})</span>
  }
  return (
    <span>
      ({start}-{end})
    </span>
  )
}

export const Hero = ({
  totalPosts,
  startIndex,
  endIndex,
}: {
  totalPosts: number
  startIndex: number
  endIndex: number
}) => (
  <HeroSection
    align={'start'}
    title={
      <>
        All {totalPosts} Posts{' '}
        <CurrentPostsCount endIndex={endIndex} startIndex={startIndex} />
      </>
    }
    variant={'compact'}
  />
)
