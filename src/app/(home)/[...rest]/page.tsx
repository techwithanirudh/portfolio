import { notFound } from 'next/navigation'

// Unknown paths 404 inside the site layout, so they keep the header and footer
export default function CatchAll(): never {
  notFound()
}
