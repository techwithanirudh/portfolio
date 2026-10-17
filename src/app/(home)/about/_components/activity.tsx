import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { SectionHeader } from '@/components/layout/sections/header'
import { buttonVariants } from '@/components/ui/button-variants'
import { ViewAnimation } from '@/components/view-animation'
import { githubUrl } from '@/constants/config'

export default function ActivityHeader(): React.ReactElement {
  return (
    <Section
      className='flex flex-wrap items-end justify-between gap-6 px-6 pt-10 pb-10'
      id='activity'
    >
      <SectionHeader
        align='left'
        description='What I have been up to on GitHub.'
        title='Activity'
      />
      <ViewAnimation delay={0.15}>
        <a
          className={buttonVariants({ size: 'sm', variant: 'outline' })}
          href={githubUrl}
          rel='noreferrer'
          target='_blank'
        >
          <Icons.github />
          GitHub
        </a>
      </ViewAnimation>
    </Section>
  )
}
