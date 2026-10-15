import type { Metadata } from 'next'
import { PanelButton } from '@/components/layout/panel'
import { HeroSection } from '@/components/layout/sections/hero'
import { createMetadata } from '@/lib/metadata'

export const metadata: Metadata = createMetadata({
  description: 'The page you are looking for could not be found.',
  robots: { follow: false, index: false },
  title: 'Not Found',
})

export default function NotFound() {
  return (
    <>
      <HeroSection
        caption='404'
        description='This page moved, never existed, or Simba buried it somewhere.'
        title='Page not found'
      />
      <div className='container mx-auto border-line border-x'>
        <PanelButton href='/'>Back home</PanelButton>
      </div>
    </>
  )
}
