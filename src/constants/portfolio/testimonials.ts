import type { Testimonial } from '@/types'

export const testimonialsIntro = {
  description:
    "I've worked with some great people. Here's what they say about working with me.",
  title: 'What others are saying',
}

export const testimonials: Testimonial[] = [
  {
    author: {
      image: '/images/testimonials/1.jpg',
      name: 'Lazare Rossilion',
    },
    description:
      "Some say 10x developers do not exist. I have met several, of which Anirudh. [...] Not only did he work really fast and well, he foresaw limitations and implemented ingenious solutions. Most impressive was his ability to quickly master things he didn't know.",
    id: 'lazare',
    title: 'Exceptional 10x developer',
  },
  {
    author: {
      image: '/images/testimonials/2.jpg',
      name: 'Vivek Ganesan',
    },
    description:
      'Congratulations on creating a very professional looking utility. Great job! The attention to detail and quality of execution is outstanding.',
    id: 'vivek',
    title: 'Professional and polished work',
  },
  {
    author: {
      image: '/images/testimonials/3.jpg',
      name: 'Karuppiah N',
    },
    description:
      'Hey! This is amazing! Demo looks awesome! The implementation is clean and the user experience is smooth. Looking forward to seeing more work.',
    id: 'karuppiah',
    title: 'Amazing execution',
  },
]
