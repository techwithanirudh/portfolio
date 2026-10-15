// Adapted from nelsonlai.dev/src/components/home/stacks-card.tsx (MIT, © 2025 Nelson Lai). See ../NOTICES.md
import { Layers } from 'lucide-react'
import Image from 'next/image'
import { technologies } from '@/constants/portfolio/skills'
import type { TechStackItem } from '@/types'
import { Marquee } from './marquee'
import { Tile, TileHeader } from './tile'

/**
 * Two opposite marquees like Nelson's, but fed by the repo's own stack list
 * and its light/dark icons (Simple Icons is not installed here).
 */
function Chip({ item }: { item: TechStackItem }) {
  const icon = item.icon
  return (
    <span className='inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-[var(--panel-raised)] px-2.5 text-[13px]'>
      {typeof icon === 'string' ? (
        <Image
          alt=''
          className='size-4'
          height={16}
          src={icon}
          unoptimized
          width={16}
        />
      ) : (
        <>
          <Image
            alt=''
            className='size-4 dark:hidden'
            height={16}
            src={icon.light}
            unoptimized
            width={16}
          />
          <Image
            alt=''
            className='hidden size-4 dark:block'
            height={16}
            src={icon.dark}
            unoptimized
            width={16}
          />
        </>
      )}
      {item.label}
    </span>
  )
}

export function StackTile() {
  const third = Math.ceil(technologies.length / 3)
  const rows = [0, 1, 2].map((i) =>
    technologies.slice(i * third, (i + 1) * third)
  )
  const categories = new Map<string, number>()
  for (const t of technologies) {
    for (const c of t.categories) {
      categories.set(c, (categories.get(c) ?? 0) + 1)
    }
  }
  return (
    <Tile md={3} span={4}>
      <TileHeader
        aside={
          <span className='vs-num text-[12px] text-[var(--muted)]'>
            {technologies.length} tools
          </span>
        }
        icon={Layers}
        title='Stack'
      />
      <div className='-mx-4 flex flex-col gap-2.5 lg:-mx-5'>
        {rows.map((row, i) => (
          <Marquee
            duration={45 + i * 8}
            gap='0.5rem'
            key={row[0]?.label ?? i}
            reverse={i % 2 === 1}
          >
            {row.map((item) => (
              <Chip item={item} key={item.label} />
            ))}
          </Marquee>
        ))}
      </div>
      <dl className='mt-auto grid grid-cols-2 gap-x-4 gap-y-1.5 border-[var(--line)] border-t pt-4'>
        {[...categories.entries()].map(([name, count]) => (
          <div className='flex items-baseline justify-between gap-2' key={name}>
            <dt className='truncate text-[12px] text-[var(--muted)]'>{name}</dt>
            <dd className='vs-num text-[12px]'>{count}</dd>
          </div>
        ))}
      </dl>
    </Tile>
  )
}
