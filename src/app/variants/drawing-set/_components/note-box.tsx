import Image from 'next/image'
import type { Testimonial } from '@/types'
import { DrawnPath } from './drawn-path'

/**
 * A testimonial as a drawing's general note: a ruled NOTE box, with a leader
 * running out to the person who wrote it. The other notes follow as the
 * numbered list a drawing keeps under its first note.
 */
export function NoteBox({ testimonials }: { testimonials: Testimonial[] }) {
  const [featured, ...rest] = testimonials
  if (!featured) {
    return null
  }

  return (
    <div className='space-y-8'>
      <div className='grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_7rem_14rem] md:gap-0'>
        <figure className='relative border border-(--ink)/80 bg-(--sheet)'>
          <div className='flex items-center justify-between border-(--line) border-b px-4 py-2'>
            <p className='ds-label text-(--ink)'>Note 1</p>
            <p className='ds-label'>{featured.title}</p>
          </div>
          <blockquote className='px-4 py-5 text-[18px] leading-relaxed tracking-[-0.005em] md:px-6 md:py-6 md:text-[20px]'>
            <span aria-hidden className='mr-1 font-mono text-(--ink-faint)'>
              “
            </span>
            {featured.description}
            <span aria-hidden className='ml-0.5 font-mono text-(--ink-faint)'>
              ”
            </span>
          </blockquote>
          <figcaption className='sr-only'>{featured.author.name}</figcaption>
        </figure>

        <svg
          aria-hidden
          className='hidden h-16 w-full overflow-visible text-(--ink-muted) md:block'
          preserveAspectRatio='none'
          viewBox='0 0 112 64'
        >
          <path d='M0 32 9 28.5v7z' fill='currentColor' />
          <DrawnPath
            d='M9 32H44L104 14'
            delay={0.15}
            fill='none'
            stroke='currentColor'
            strokeWidth={0.9}
          />
          <circle cx='104' cy='14' fill='currentColor' r='2' />
        </svg>

        <div className='flex items-center gap-3 md:-mt-9 md:pl-1'>
          <Image
            alt=''
            className='size-11 rounded-full border border-(--line) object-cover grayscale'
            height={88}
            src={featured.author.image}
            width={88}
          />
          <div>
            <p className='font-medium text-[15px]'>{featured.author.name}</p>
            <p className='ds-label'>Author, note 1</p>
          </div>
        </div>
      </div>

      {rest.length > 0 && (
        <ol className='grid gap-x-8 gap-y-4 border-(--line) border-t border-dashed pt-5 md:grid-cols-2'>
          {rest.map((note, i) => (
            <li
              className='grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2'
              key={note.author.name}
            >
              <span className='ds-label pt-0.5 text-(--ink)'>
                {String(i + 2).padStart(2, '0')}.
              </span>
              <div>
                <p className='text-(--ink-muted) text-[15px] leading-relaxed'>
                  “{note.description}”
                </p>
                <p className='ds-label mt-1.5'>— {note.author.name}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
