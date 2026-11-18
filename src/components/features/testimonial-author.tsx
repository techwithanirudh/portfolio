import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { initials } from '@/lib/initials'
import type { Testimonial } from '@/types'

export const TestimonialAuthor = ({
  author,
}: {
  author: Testimonial['author']
}) => (
  <p className='flex flex-row items-center gap-2 text-sm'>
    <Avatar className='size-6' outlined={false}>
      <AvatarImage alt='' src={author.image} />
      <AvatarFallback>{initials(author.name)}</AvatarFallback>
    </Avatar>
    <span>{author.name}</span>
  </p>
)
