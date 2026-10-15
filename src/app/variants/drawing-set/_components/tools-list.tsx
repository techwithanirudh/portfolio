import { ArrowUpRightIcon } from 'lucide-react'
import Image from 'next/image'
import { hardware, software } from '@/constants/portfolio/uses'
import type { Logo, SoftwareItem } from '@/types/uses'
import { CollapsibleList } from './collapsible-list'
import { pad } from './data'

function SoftwareLogo({ logo }: { logo?: Logo }) {
  if (!logo) {
    return <span className='size-4 rounded-[3px] border border-(--line)' />
  }
  if (typeof logo === 'string') {
    return (
      <Image
        alt=''
        className='size-4 object-contain'
        height={16}
        src={logo}
        width={16}
      />
    )
  }
  return (
    <>
      <Image
        alt=''
        className='size-4 object-contain dark:hidden'
        height={16}
        src={logo.light}
        width={16}
      />
      <Image
        alt=''
        className='hidden size-4 object-contain dark:block'
        height={16}
        src={logo.dark}
        width={16}
      />
    </>
  )
}

function SoftwareRow({ index, item }: { index: number; item: SoftwareItem }) {
  return (
    <a
      className='group grid h-full grid-cols-[2rem_1rem_minmax(0,1fr)] items-center gap-x-2.5 px-4 py-2.5 transition-colors hover:bg-(--hover) md:px-5'
      href={item.url}
      rel='noopener'
      target='_blank'
    >
      <span className='font-mono text-(--ink-faint) text-[11px] tabular-nums'>
        S{pad(index + 1)}
      </span>
      <SoftwareLogo logo={item.logo} />
      <span className='min-w-0'>
        <span className='block truncate font-medium text-sm group-hover:text-(--accent)'>
          {item.name}
          {item.featured && (
            <span
              className='ml-1.5 align-middle text-(--redline) text-[10px]'
              title='Daily driver'
            >
              ●
            </span>
          )}
        </span>
        <span className='block truncate text-(--ink-muted) text-xs'>
          {item.description}
        </span>
      </span>
    </a>
  )
}

/**
 * Hardware and software as a drawing's tools parts list: numbered parts with
 * their spec, hardware as a two-up schedule, software as a dense grid.
 */
export function ToolsList() {
  const half = Math.ceil(hardware.length / 2)
  const columns = [hardware.slice(0, half), hardware.slice(half)]

  return (
    <div>
      <div className='flex items-center justify-between border-(--line) border-b bg-(--paper) px-4 py-2 md:px-6'>
        <p className='ds-label text-(--ink)'>Hardware</p>
        <p className='ds-label'>{hardware.length} parts</p>
      </div>
      <div className='grid md:grid-cols-2'>
        {columns.map((column, c) => (
          <ol
            className='border-(--line) border-dashed md:first:border-r'
            key={c === 0 ? 'left' : 'right'}
          >
            {column.map((item, i) => {
              const n = c * half + i + 1
              const body = (
                <>
                  <span className='font-mono text-(--ink-faint) text-[11px] tabular-nums'>
                    H{pad(n)}
                  </span>
                  <span className='min-w-0'>
                    <span className='block font-medium text-sm'>
                      {item.name}
                    </span>
                    <span className='block text-(--ink-muted) text-xs'>
                      {item.description}
                    </span>
                  </span>
                  {item.url && (
                    <ArrowUpRightIcon
                      aria-hidden
                      className='size-3.5 text-(--ink-faint) group-hover:text-(--ink)'
                    />
                  )}
                </>
              )
              return (
                <li
                  className='border-(--line) border-b border-dashed last:border-b-0 max-md:last:border-b'
                  key={item.name}
                >
                  {item.url ? (
                    <a
                      className='group grid grid-cols-[2.5rem_minmax(0,1fr)_1rem] items-center gap-x-3 px-4 py-2.5 transition-colors hover:bg-(--hover) md:px-6'
                      href={item.url}
                      rel='noopener'
                      target='_blank'
                    >
                      {body}
                    </a>
                  ) : (
                    <div className='grid grid-cols-[2.5rem_minmax(0,1fr)_1rem] items-center gap-x-3 px-4 py-2.5 md:px-6'>
                      {body}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        ))}
      </div>

      <div className='flex items-center justify-between border-(--line) border-y bg-(--paper) px-4 py-2 md:px-6'>
        <p className='ds-label text-(--ink)'>Software</p>
        <p className='ds-label flex items-center gap-1.5'>
          <span className='text-(--redline)'>●</span> daily driver
          <span className='px-1 text-(--ink-faint)'>·</span>
          {software.length} parts
        </p>
      </div>
      <CollapsibleList
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        itemClassName='border-(--line) border-b border-dashed sm:border-r sm:nth-[2n]:border-r-0 lg:nth-[2n]:border-r lg:nth-[4n]:border-r-0'
        items={software}
        keyExtractor={(item) => item.name}
        max={16}
        renderItem={(item, index) => <SoftwareRow index={index} item={item} />}
      />
    </div>
  )
}
