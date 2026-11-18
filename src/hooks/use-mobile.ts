import { useMediaQuery } from 'usehooks-ts'
import { MEDIA } from '@/lib/media'

export const useIsMobile = () =>
  useMediaQuery(MEDIA.mobile, { initializeWithValue: false })
