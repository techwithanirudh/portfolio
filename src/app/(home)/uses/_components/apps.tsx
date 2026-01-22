import { BadgeCheckIcon } from 'lucide-react'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { uses } from '@/constants/portfolio'
import { cn } from '@/lib/utils'
import { Logo } from './logo'

export default function Apps() {
  return (
    <>
      {uses.map((group) => (
        <Section key={group.category}>
          <div className='grid divide-y divide-dashed divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
            <div className='bg-dashed'>
              <ViewAnimation
                className='h-full'
                initial={{ opacity: 0, translateY: -6 }}
                whileInView={{ opacity: 1, translateY: 0 }}
              >
                <div className='flex flex-col gap-1 p-6.5 sm:sticky sm:top-16'>
                  <h2 className='font-semibold text-2xl'>{group.category}</h2>
                  <p className='text-muted-foreground text-sm'>
                    {group.items.length} tools
                  </p>
                </div>
              </ViewAnimation>
            </div>
            <div className='grid sm:col-span-2 sm:grid-cols-2'>
              {group.items
                .toSorted((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                .map((app, index) => (
                  <div
                    className={cn(
                      index > 0 && 'border-border border-t border-dashed',
                      index < 2 && 'sm:border-t-0',
                      index % 2 === 0 &&
                        'sm:border-border sm:border-r sm:border-dashed'
                    )}
                    key={app.name}
                  >
                    <ViewAnimation
                      delay={0.05 * index}
                      initial={{ opacity: 0, translateY: -6 }}
                      whileInView={{ opacity: 1, translateY: 0 }}
                    >
                      <a
                        className={cn(
                          'flex items-start gap-4 p-6 transition-colors hover:bg-secondary/50 group/app',
                          'sm:p-8'
                        )}
                        href={app.url}
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        <Logo
                          alt={app.name}
                          className='rounded-md ring-1 ring-foreground/5  transition-transform group-hover/app:-rotate-12 group-hover/app:scale-115'
                          logo={app.logo}
                          size={40}
                        />
                        <div className='flex-1'>
                          <div className='flex items-center gap-1.5'>
                            <h3 className='font-semibold tracking-tight'>
                              {app.name}
                            </h3>
                            {app.featured && (
                              <BadgeCheckIcon
                                className='text-primary'
                                size={16}
                              />
                            )}
                          </div>
                          <p className='text-muted-foreground text-sm'>
                            {app.description}
                          </p>
                        </div>
                      </a>
                    </ViewAnimation>
                  </div>
                ))}
              {group.items.length % 2 === 1 && (
                <ViewAnimation
                  className='hidden sm:block'
                  delay={0.05 * group.items.length}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                >
                  <div className='size-full min-h-[104px] border-border border-dashed bg-dashed sm:border-t-0' />
                </ViewAnimation>
              )}
            </div>
          </div>
        </Section>
      ))}
    </>
  )
}
