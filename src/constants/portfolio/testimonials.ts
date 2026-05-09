import type { Testimonial } from '@/types'

export const testimonials: Testimonial[] = [
  {
    title: 'Exceptional 10x Developer',
    description:
      "Some say 10x developers do not exist. I have met several, of which Anirudh. [...] Not only did he work really fast and well, he foresaw limitations and implemented ingenious solutions. Most impressive was his ability to quickly master things he didn't know.",
    author: {
      name: 'Lazare Rossilion',
      image: '/images/testimonials/1.jpg',
    },
  },
  {
    title: 'Professional and Polished Work',
    description:
      'Congratulations on creating a very professional looking utility. Great job! The attention to detail and quality of execution is outstanding.',
    author: {
      name: 'Vivek Ganesan',
      image: '/images/testimonials/2.jpg',
    },
  },
  {
    title: 'Amazing Execution',
    description:
      'Hey! This is amazing! Demo looks awesome! The implementation is clean and the user experience is smooth. Looking forward to seeing more work.',
    author: {
      name: 'Karuppiah N',
      image: '/images/testimonials/3.jpg',
    },
  },
]
