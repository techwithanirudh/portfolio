// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import { Icons } from '@/components/icons/icons'
import { Section } from '@/components/layout/sections'
import { experiences } from '@/constants/portfolio/experiences'
import { profile } from '@/constants/portfolio/profile'
import { EmailItem } from './email-item'
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from './intro-item'
import { LocalTimeItem } from './local-time-item'

const current = experiences.find((experience) => experience.isCurrentEmployer)
const currentRole = current?.positions[0]?.title

export function Overview() {
  return (
    <Section>
      <h2 className='sr-only'>Overview</h2>
      <div className='grid gap-x-4 gap-y-2.5 p-4 sm:grid-cols-2'>
        {current && (
          <IntroItem>
            <IntroItemIcon>
              <Icons.codeXml />
            </IntroItemIcon>
            <IntroItemContent>
              {currentRole} @{' '}
              {current.companyWebsite ? (
                <IntroItemLink
                  className='font-medium'
                  href={current.companyWebsite}
                >
                  {current.companyName}
                </IntroItemLink>
              ) : (
                <span className='font-medium'>{current.companyName}</span>
              )}
            </IntroItemContent>
          </IntroItem>
        )}
        <IntroItem>
          <IntroItemIcon>
            <Icons.user />
          </IntroItemIcon>
          <IntroItemContent>{profile.pronouns}</IntroItemContent>
        </IntroItem>
        <IntroItem>
          <IntroItemIcon>
            <Icons.globe />
          </IntroItemIcon>
          <IntroItemContent>{profile.location}</IntroItemContent>
        </IntroItem>
        <LocalTimeItem timeZone={profile.timeZone} />
        <EmailItem emailB64={profile.emailB64} />
        <IntroItem>
          <IntroItemIcon>
            <Icons.github />
          </IntroItemIcon>
          <IntroItemContent>
            <IntroItemLink href='https://github.com/techwithanirudh'>
              techwithanirudh
            </IntroItemLink>
          </IntroItemContent>
        </IntroItem>
      </div>
      <div className='pointer-events-none absolute inset-y-0 left-1/2 -z-1 w-px -translate-x-2.25 border-line border-r max-sm:hidden' />
    </Section>
  )
}
