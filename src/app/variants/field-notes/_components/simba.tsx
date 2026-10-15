import { cn } from '@/lib/utils'

/**
 * Simba, the site's Shih Tzu, as a quick ballpoint doodle: a topknot tied
 * with a bow, long wavy ears, big eyes, a beard and the tongue out. Drawn
 * for this variant; it is not the mascot rig.
 */
export function SimbaDoodle({
  className,
  title = 'A doodle of Simba the Shih Tzu',
}: {
  className?: string
  title?: string
}) {
  return (
    <svg
      className={cn('fn-ink-stroke', className)}
      role='img'
      strokeWidth='1.7'
      viewBox='0 0 96 96'
    >
      <title>{title}</title>
      {/* topknot and bow */}
      <path d='M48 24c-1.4-5.6-5.2-9-10.4-9.4M48 24c1.4-5.6 5.2-9 10.4-9.4M48 24c-.4-5.4.6-9.6 3.2-12.6' />
      <path d='M48 26.4c-3.8-3.2-8.4-3.4-8.6-.4-.2 3.2 4.6 3.6 8.6.4zM48 26.4c3.8-3.2 8.4-3.4 8.6-.4.2 3.2-4.6 3.6-8.6.4z' />
      {/* crown of the head */}
      <path d='M30.6 40.4c.6-8.8 8-14 17.4-14s16.8 5.2 17.4 14' />
      {/* long wavy ears */}
      <path d='M31.4 35.6c-5 1-8.4 5-10.2 10-1.6 1.2-2 3.4-1.2 5.2-1.4 1.6-1.6 4-.4 5.8-1.2 2-1 4.6.6 6.2-.8 2.4 0 5 2 6.2.4 2.2 2.6 3.6 4.8 3 1.8 1 4.2.2 5-1.8' />
      <path d='M64.6 35.6c5 1 8.4 5 10.2 10 1.6 1.2 2 3.4 1.2 5.2 1.4 1.6 1.6 4 .4 5.8 1.2 2 1 4.6-.6 6.2.8 2.4 0 5-2 6.2-.4 2.2-2.6 3.6-4.8 3-1.8 1-4.2.2-5-1.8' />
      <path d='M25.6 54.4c.8 3 .6 6-.6 9M70.4 54.4c-.8 3-.6 6 .6 9' />
      {/* fluffy cheeks and beard */}
      <path d='M33 44c-1.6 3-.4 5.6 1 7-1 2.6 0 5.2 2 6.4-.2 2.6 1.6 4.6 4 5 .8 2.2 3 3.4 5.2 3 1.4 1.4 4.2 1.4 5.6 0 2.2.4 4.4-.8 5.2-3 2.4-.4 4.2-2.4 4-5 2-1.2 3-3.8 2-6.4 1.4-1.4 2.6-4 1-7' />
      {/* eyes */}
      <circle cx='40.2' cy='45.4' fill='currentColor' r='2.8' stroke='none' />
      <circle cx='55.8' cy='45.4' fill='currentColor' r='2.8' stroke='none' />
      <circle
        cx='41.2'
        cy='44.4'
        fill='var(--fn-page, #fff)'
        r='.8'
        stroke='none'
      />
      <circle
        cx='56.8'
        cy='44.4'
        fill='var(--fn-page, #fff)'
        r='.8'
        stroke='none'
      />
      <path d='M36.4 40.8c1.8-1.2 4.2-1.4 6-.6M59.6 40.8c-1.8-1.2-4.2-1.4-6-.6' />
      {/* nose, moustache, tongue */}
      <path
        d='M44.8 52.4c2.1-1.1 4.3-1.1 6.4 0 .1 2-1.4 3.4-3.2 3.4s-3.3-1.4-3.2-3.4z'
        fill='currentColor'
      />
      <path d='M48 55.8v2.4M41.6 57.6c2.2 2.8 4.8 3 6.4.6 1.6 2.4 4.2 2.2 6.4-.6' />
      <path d='M46.3 59.4c-.2 3.2.4 4.8 1.7 4.8s1.9-1.6 1.7-4.8' />
      {/* chest */}
      <path d='M30 74c-3.6 5.4-5 11-5.2 16M66 74c3.6 5.4 5 11 5.2 16' />
      <path d='M37.6 73.4c3 3.6 6.6 5 10.4 5s7.4-1.4 10.4-5' />
    </svg>
  )
}
