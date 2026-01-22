import { Fragment } from 'react'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { uses } from '@/constants/portfolio'
import { AppIcon } from './app-icon'
import { HardwareCard } from './hardware-card'

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
                <div className='grid grid-cols-3 justify-items-center gap-6 p-6 sm:grid-cols-4 sm:p-8 md:grid-cols-5 lg:grid-cols-8'>
                  {group.items
                    .toSorted(
                      (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
                    )
                    .map((item) => (
                      <AppIcon key={item.name} {...item} />
                    ))}
                </div>
              ) : (
                <div className='grid divide-dashed divide-border sm:grid-cols-2 sm:divide-x lg:grid-cols-3'>
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
