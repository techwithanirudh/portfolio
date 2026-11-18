interface Author {
  image: string
  name: string
}

export interface Testimonial {
  author: Author
  description: string
  /** Names the testimonial in Simba's chat cards */
  id: string
  title: string
}
