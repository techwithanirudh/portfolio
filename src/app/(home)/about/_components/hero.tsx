import { PortraitHeading } from '@/app/(home)/_components/portrait'
import {
  HeroSection,
  heroTitleClassName,
  TitleDot,
} from '@/components/layout/sections/hero'
import { pages } from '@/constants/pages'

export default function Hero(): React.ReactElement {
  return (
    <HeroSection
      description={pages.about.description}
      heading={
        <PortraitHeading
          after={
            <>
              <span className='-ml-[0.09em]'>me</span>
              <TitleDot />
            </>
          }
          before={pages.about.title}
          className={heroTitleClassName}
        />
      }
    />
  )
}
