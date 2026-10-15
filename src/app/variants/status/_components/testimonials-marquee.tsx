import { Quote } from 'lucide-react'
import Image from 'next/image'
import { testimonials } from '../../_shared/profile'
import { Marquee } from './marquee'

export function TestimonialsMarquee() {
  return (
    <Marquee className='-mx-4 py-1 sm:-mx-6' duration={60} gap='1rem'>
      {testimonials.map((t) => (
        <figure
          className='vs-card flex w-[20rem] shrink-0 flex-col gap-4 p-5 sm:w-[24rem]'
          key={t.author.name}
        >
          <div className='flex items-center justify-between'>
            <p className='font-medium text-[13px]'>{t.title}</p>
            <Quote aria-hidden className='size-4 text-[var(--line-strong)]' />
          </div>
          <blockquote className='line-clamp-5 text-[14px] text-[var(--muted)] leading-relaxed'>
            “{t.description}”
          </blockquote>
          <figcaption className='mt-auto flex items-center gap-2.5'>
            <Image
              alt=''
              className='size-7 rounded-full object-cover'
              height={28}
              src={t.author.image}
              width={28}
            />
            <span className='text-[13px]'>{t.author.name}</span>
          </figcaption>
        </figure>
      ))}
    </Marquee>
  )
}
