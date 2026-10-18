import { PortraitChip } from '@/app/(home)/_components/portrait'
import { HeroSection, TitleDot } from '@/components/layout/sections/hero'
import { pages } from '@/constants/pages'

export default function Hero(): React.ReactElement {
  return (
    <HeroSection
      description={pages.about.description}
      title={
        <>
          {pages.about.title} <PortraitChip />{' '}
          <span className='-ml-[0.09em]'>me</span>
          <TitleDot />
        </>
      }
    />
  )
}
