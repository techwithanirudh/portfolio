'use client'

import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import {
  coding,
  hardware,
  software,
  usesTabs,
} from '@/constants/portfolio/uses'
import { CodingSection } from './coding-section'
import { HardwareGrid } from './hardware-grid'
import { SoftwareGrid } from './software-grid'
import { UsesHero } from './uses-hero'
import { UsesTabs, useUsesTab } from './uses-tabs'

export function UsesContent() {
  const { activeTab, handleTabChange } = useUsesTab()

  const showAll = activeTab === 'all'
  const showHardware = showAll || activeTab === 'hardware'
  const showSoftware = showAll || activeTab === 'software'
  const showCoding = showAll || activeTab === 'coding'

  return (
    <>
      <Section className='p-6'>
        <ViewAnimation
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <UsesTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            tabs={usesTabs}
          />
        </ViewAnimation>
      </Section>

      {showAll && (
        <Section>
          <ViewAnimation
            initial={{ opacity: 0, translateY: 6 }}
            whileInView={{ opacity: 1, translateY: 0 }}
          >
            <UsesHero
              caption='My desk setup in 2025'
              imageSrc='/images/uses/desk-setup.jpg'
            />
          </ViewAnimation>
        </Section>
      )}

      {showHardware && (
        <>
          <Section className='p-6'>
            <ViewAnimation
              delay={0.1}
              initial={{ opacity: 0, translateY: 6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <h2 className='font-medium text-xl'>Hardware</h2>
            </ViewAnimation>
          </Section>
          <Section>
            <ViewAnimation
              delay={0.15}
              initial={{ opacity: 0, translateY: 6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <HardwareGrid items={hardware} />
            </ViewAnimation>
          </Section>
        </>
      )}

      {showSoftware && (
        <>
          <Section className='p-6'>
            <ViewAnimation
              delay={0.1}
              initial={{ opacity: 0, translateY: 6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <h2 className='font-medium text-xl'>Software</h2>
            </ViewAnimation>
          </Section>
          <Section>
            <ViewAnimation
              delay={0.15}
              initial={{ opacity: 0, translateY: 6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <SoftwareGrid items={software} />
            </ViewAnimation>
          </Section>
        </>
      )}

      {showCoding && (
        <>
          <Section className='p-6'>
            <ViewAnimation
              delay={0.1}
              initial={{ opacity: 0, translateY: 6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <h2 className='font-medium text-xl'>Coding</h2>
            </ViewAnimation>
          </Section>
          <Section>
            <ViewAnimation
              delay={0.15}
              initial={{ opacity: 0, translateY: 6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <CodingSection config={coding} />
            </ViewAnimation>
          </Section>
        </>
      )}
    </>
  )
}
