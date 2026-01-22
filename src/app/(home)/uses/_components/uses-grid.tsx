import { Fragment } from 'react'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { uses } from '@/constants/portfolio'
import { AppIcon } from './app-icon'
import { HardwareCard } from './hardware-card'

function getFillerCount(itemCount: number, columns: number) {
  const remainder = itemCount % columns
  return remainder === 0 ? 0 : columns - remainder
}

export default function UsesGrid() {
  return (
    <>
      {uses.map((group, groupIndex) => (
        <Fragment key={group.category}>
          <Section className='p-6'>
            <ViewAnimation
              delay={0.1 * groupIndex}
              initial={{ opacity: 0, translateY: 6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <h2 className='font-medium text-xl'>{group.category}</h2>
            </ViewAnimation>
          </Section>
          <Section>
            <ViewAnimation
              delay={0.1 * groupIndex + 0.05}
              initial={{ opacity: 0, translateY: 6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              {group.type === 'applications' ? (
                <div className='grid grid-cols-3 divide-x divide-dashed divide-border sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 [&>*]:border-border [&>*]:border-b [&>*]:border-dashed [&>*:nth-last-child(-n+3)]:border-b-0 sm:[&>*:nth-last-child(-n+3)]:border-b sm:[&>*:nth-last-child(-n+4)]:border-b-0 md:[&>*:nth-last-child(-n+4)]:border-b md:[&>*:nth-last-child(-n+5)]:border-b-0 lg:[&>*:nth-last-child(-n+5)]:border-b lg:[&>*:nth-last-child(-n+8)]:border-b-0'>
                  {group.items
                    .toSorted(
                      (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
                    )
                    .map((item) => (
                      <AppIcon key={item.name} {...item} />
                    ))}
                  {Array.from({
                    length: getFillerCount(group.items.length, 8),
                  }).map((_, i) => (
                    <div
                      className='hidden min-h-[120px] bg-dashed lg:block'
                      key={`filler-lg-${i}`}
                    />
                  ))}
                  {Array.from({
                    length: getFillerCount(group.items.length, 5),
                  }).map((_, i) => (
                    <div
                      className='hidden min-h-[120px] bg-dashed md:block lg:hidden'
                      key={`filler-md-${i}`}
                    />
                  ))}
                  {Array.from({
                    length: getFillerCount(group.items.length, 4),
                  }).map((_, i) => (
                    <div
                      className='hidden min-h-[120px] bg-dashed sm:block md:hidden'
                      key={`filler-sm-${i}`}
                    />
                  ))}
                  {Array.from({
                    length: getFillerCount(group.items.length, 3),
                  }).map((_, i) => (
                    <div
                      className='min-h-[120px] bg-dashed sm:hidden'
                      key={`filler-base-${i}`}
                    />
                  ))}
                </div>
              ) : (
                <div className='grid divide-x divide-dashed divide-border sm:grid-cols-2 lg:grid-cols-3 [&>*]:border-border [&>*]:border-b [&>*]:border-dashed [&>*:last-child]:border-b-0 sm:[&>*:nth-last-child(-n+2)]:border-b-0 lg:[&>*:nth-last-child(-n+2)]:border-b lg:[&>*:nth-last-child(-n+3)]:border-b-0'>
                  {group.items.map((item) => (
                    <HardwareCard key={item.name} {...item} />
                  ))}
                </div>
              )}
            </ViewAnimation>
          </Section>
        </Fragment>
      ))}
    </>
  )
}
