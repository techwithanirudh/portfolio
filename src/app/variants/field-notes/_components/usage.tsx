// Adapted from victoreke.com/app/components/pages/Usage.tsx,
// app/components/shared/CustomPortableTextFavicon.tsx and app/utils/favicon.tsx
// (MIT, © 2023 Victor Eke). See ../NOTICES.md
import { hardware, software } from '@/constants/portfolio/uses'
import { cn } from '@/lib/utils'
import type { HardwareItem, SoftwareItem } from '@/types'

/** The hostname Google's favicon service is asked about. */
const WWW = /^www\./

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(WWW, '')
  } catch {
    return url
  }
}

/**
 * Victor's Favicon, reimplemented without next/image remote config: the
 * item's own logo when the repo has one (light and dark), otherwise the
 * Google favicon for its domain.
 */
function Favicon({ logo, url }: { logo?: SoftwareItem['logo']; url?: string }) {
  const cls =
    'mr-2 inline-block size-[17px] shrink-0 rounded-[3px] object-contain'
  if (typeof logo === 'string') {
    return (
      // biome-ignore lint/performance/noImgElement: tiny static icon, no optimization needed
      <img
        alt=''
        className={cls}
        height={17}
        loading='lazy'
        src={logo}
        width={17}
      />
    )
  }
  if (logo) {
    return (
      <>
        {/* biome-ignore lint/performance/noImgElement: tiny static icon */}
        <img
          alt=''
          className={cn(cls, 'dark:hidden')}
          height={17}
          loading='lazy'
          src={logo.light}
          width={17}
        />
        {/* biome-ignore lint/performance/noImgElement: tiny static icon */}
        <img
          alt=''
          className={cn(cls, 'hidden dark:inline-block')}
          height={17}
          loading='lazy'
          src={logo.dark}
          width={17}
        />
      </>
    )
  }
  if (!url) {
    return null
  }
  return (
    // biome-ignore lint/performance/noImgElement: remote favicon service
    <img
      alt=''
      className={cls}
      height={17}
      loading='lazy'
      src={`https://www.google.com/s2/favicons?domain=${domainOf(url)}&sz=32`}
      width={17}
    />
  )
}

function Line({
  description,
  featured,
  logo,
  name,
  url,
}: {
  description: string
  featured?: boolean
  logo?: SoftwareItem['logo']
  name: string
  url?: string
}) {
  return (
    <li className='mb-3.5 break-inside-avoid'>
      {url ? (
        <a
          className='fn-link inline-flex items-center font-medium text-[var(--fn-ink)]'
          href={url}
          rel='noopener'
          target='_blank'
        >
          <Favicon logo={logo} url={url} />
          {name}
        </a>
      ) : (
        <span className='inline-flex items-center font-medium'>
          <Favicon logo={logo} />
          {name}
        </span>
      )}
      {featured ? (
        <span
          className='fn-hand ml-1.5 text-[1.15rem]'
          title='Featured on the uses page'
        >
          ★
        </span>
      ) : null}
      <span className='text-[var(--fn-muted)]'> — {description}</span>
    </li>
  )
}

function Group({
  children,
  id,
  title,
}: {
  children: React.ReactNode
  id: string
  title: string
}) {
  return (
    <div className='mt-8'>
      <h3
        className='fn-serif group relative mb-4 inline-block text-[1.6rem] leading-tight'
        id={id}
      >
        <a className='rounded-sm' href={`#${id}`}>
          <span
            aria-hidden
            className='absolute top-1/2 -left-5 hidden -translate-y-1/2 text-[var(--fn-muted)] group-hover:inline'
          >
            #
          </span>
          {title}
        </a>
      </h3>
      {children}
    </div>
  )
}

export function Usage() {
  const sorted = (items: SoftwareItem[]) =>
    items.toSorted(
      (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    )

  return (
    <section aria-labelledby='fn-uses'>
      <div className='mb-2'>
        <p className='fn-label mb-2'>03 · Tools</p>
        <h2
          className='fn-serif text-[2.1rem] leading-[1.05] sm:text-[2.6rem]'
          id='fn-uses'
        >
          What I use
        </h2>
        <p className='fn-measure mt-4 text-[var(--fn-muted)]'>
          Tools, technologies and gadgets I use most days, but not limited to.
          Starred ones are the ones featured on the{' '}
          <a className='fn-link' href='/uses'>
            uses page
          </a>
          .
        </p>
      </div>
      <Group id='fn-hardware' title='Hardware'>
        <ul className='text-[15.5px] sm:columns-2 sm:gap-10'>
          {hardware.map((item: HardwareItem) => (
            <Line
              description={item.description}
              key={item.name}
              name={item.name}
              url={item.url}
            />
          ))}
        </ul>
      </Group>
      <Group id='fn-software' title='Software'>
        <ul className='text-[15.5px] sm:columns-2 sm:gap-10'>
          {sorted(software).map((item) => (
            <Line
              description={item.description}
              featured={item.featured}
              key={item.name}
              logo={item.logo}
              name={item.name}
              url={item.url}
            />
          ))}
        </ul>
      </Group>
    </section>
  )
}
