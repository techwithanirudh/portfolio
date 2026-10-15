import { HeroSection } from '@/components/layout/sections/hero'

export const Hero = ({
  totalWorks,
  startIndex,
  endIndex,
}: {
  totalWorks: number
  startIndex: number
  endIndex: number
}) => {
  const end = Math.min(endIndex, totalWorks)
  const showRange = totalWorks > end - startIndex

  return (
    <HeroSection
      caption={
        <span className='flex items-center justify-between gap-4'>
          <span>{totalWorks} projects</span>
          {showRange && (
            <span className='tabular-nums'>
              {startIndex + 1}-{end}
            </span>
          )}
        </span>
      }
      description='A snapshot of recent projects and collaborations.'
      title='Projects'
    />
  )
}
