// TODO(slopradar): unused export: nothing imports Author (only Testimonial uses it), make it module-private
export interface Author {
  image: string
  name: string
}

export interface Testimonial {
  author: Author
  description: string
  title: string
}
