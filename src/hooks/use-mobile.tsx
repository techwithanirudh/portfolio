import { useMediaQuery } from 'usehooks-ts'
import { MEDIA } from '@/lib/media'

// False on the server and the first client render, like the shadcn original
export const useIsMobile = () =>
  useMediaQuery(MEDIA.mobile, { initializeWithValue: false })
