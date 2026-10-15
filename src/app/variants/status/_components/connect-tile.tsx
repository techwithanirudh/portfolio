// Adapted from nelsonlai.dev/src/components/home/connect.tsx (MIT, © 2025 Nelson Lai). See ../NOTICES.md
import { ArrowUpRight, Link as LinkIcon } from 'lucide-react'
import { socials } from '@/constants/navigation'
import { Tile, TileHeader } from './tile'

const handleOf = (url: string) => {
  if (url.startsWith('mailto:')) {
    return url.replace('mailto:', '')
  }
  const path = new URL(url).pathname.split('/').filter(Boolean).at(-1) ?? ''
  return path.startsWith('@') ? path : `@${path}`
}

export function ConnectTile() {
  return (
    <Tile md={3} span={4}>
      <TileHeader icon={LinkIcon} title='Connect' />
      <ul className='-mx-1 flex flex-col'>
        {socials.map((link) => (
          <li key={link.url}>
            <a
              className='group flex items-center gap-3 rounded-lg px-2 py-2 text-[var(--muted)] transition-colors hover:bg-[var(--panel-raised)] hover:text-[var(--text)] [&>svg]:size-4'
              href={link.url}
              rel={link.url.startsWith('http') ? 'noopener' : undefined}
              target={link.url.startsWith('http') ? '_blank' : undefined}
            >
              {link.icon}
              <span className='text-[13px] text-[var(--text)]'>
                {link.name}
              </span>
              <span className='vs-num ml-auto truncate text-[12px]'>
                {handleOf(link.url)}
              </span>
              <ArrowUpRight
                aria-hidden
                className='size-3.5! shrink-0 opacity-0 transition-opacity group-hover:opacity-100'
              />
            </a>
          </li>
        ))}
      </ul>
    </Tile>
  )
}
