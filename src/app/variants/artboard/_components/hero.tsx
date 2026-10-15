import { ArrowRight, Download, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { profile } from '../../_shared/profile'
import { heroInfo } from './data'
import { ImageFrame } from './figure'
import { LocalTime } from './local-time'
import { BASE } from './nav'
import { Selectable } from './selectable'

/** The avatar in a frame with crop marks and a rule-of-thirds overlay. */
export function Avatar({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <div className='ab-avatar relative'>
        <ImageFrame
          alt={`${profile.name}'s profile picture`}
          className='aspect-square w-full rounded-[2px]'
          layer='profile.png'
          priority
          sizes='(min-width: 768px) 200px, 112px'
          src={profile.avatar}
        />
        <span aria-hidden className='ab-thirds' />
        {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
          <span aria-hidden className='ab-crop' data-c={c} key={c} />
        ))}
      </div>
      <figcaption className='ab-t-label mt-6 flex justify-between text-(--muted)'>
        <span>profile.png</span>
        <span>1 : 1</span>
      </figcaption>
    </figure>
  )
}

function Meta({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <div className='ab-rule grid grid-cols-[72px_minmax(0,1fr)] items-baseline gap-3 border-t py-2.5'>
      <dt className='ab-t-label text-(--faint)'>{label}</dt>
      <dd className='min-w-0 text-[13px] leading-5'>{children}</dd>
    </div>
  )
}

export function Hero() {
  return (
    <Selectable info={heroInfo} isDefault layer='Hero / Intro'>
      <div className='grid gap-8 p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_200px] md:gap-12 md:p-12'>
        <div className='order-2 min-w-0 md:order-1'>
          <p
            className='ab-t-label text-(--muted)'
            data-layer='Role'
            data-layer-type='text'
          >
            Design engineer · Full-stack developer · @{profile.handle}
          </p>
          <h1
            className='ab-t-display mt-3'
            data-layer='Name'
            data-layer-type='text'
            data-outline-text
          >
            {profile.name}
          </h1>
          <p
            className='ab-t-lead mt-4 max-w-[46ch] text-(--muted)'
            data-layer='Bio'
            data-layer-type='text'
          >
            {profile.description}
          </p>

          <dl
            className='ab-rule mt-7 border-b'
            data-layer='Details'
            data-layer-type='group'
          >
            <Meta label='Now'>
              <a
                className='inline-flex items-center gap-2'
                href={profile.current.url}
                rel='noopener'
                target='_blank'
              >
                <span className='ab-rule relative size-5 flex-none overflow-hidden rounded border'>
                  <Image
                    alt=''
                    className='object-cover'
                    fill
                    sizes='20px'
                    src='/images/companies/quiverai.png'
                  />
                </span>
                <span>
                  {profile.current.title} at{' '}
                  <span className='ab-link font-medium'>
                    {profile.current.company}
                  </span>
                </span>
              </a>
            </Meta>
            <Meta label='Local time'>
              <LocalTime timeZone={profile.timeZone} />
            </Meta>
            <Meta label='Based in'>{profile.location}</Meta>
          </dl>

          <div className='mt-7 flex flex-wrap gap-2'>
            <Link className='ab-btn ab-btn-primary' href={`${BASE}/work`}>
              See the work
              <ArrowRight aria-hidden className='size-3.5' />
            </Link>
            <a className='ab-btn ab-btn-ghost' href={`mailto:${profile.email}`}>
              <Mail aria-hidden className='size-3.5' />
              {profile.email}
            </a>
            <a className='ab-btn ab-btn-ghost' download href='/resume.pdf'>
              <Download aria-hidden className='size-3.5' />
              Résumé
            </a>
          </div>
        </div>
        <Avatar className='order-1 w-28 md:order-2 md:w-full md:pt-2' />
      </div>
    </Selectable>
  )
}
