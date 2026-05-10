import type { IconProps } from '../utils'
import { getSvgSizeProps } from '../utils'

export const V0Icon = ({ height, size, width, ...props }: IconProps) => (
  <svg
    aria-hidden
    fill='currentColor'
    viewBox='0 0 40 20'
    xmlns='http://www.w3.org/2000/svg'
    {...getSvgSizeProps({ height, size, width })}
    {...props}
  >
    <path d='M23.39 0H32.92C36.78 0 39.91 3.13 39.91 6.99V16.08H36V6.99C36 6.9 35.99 6.81 35.99 6.72L26.46 16.08C26.49 16.08 26.53 16.08 26.56 16.08H36V19.78H26.56C22.7 19.78 19.48 16.61 19.48 12.75V3.69H23.39V12.75C23.39 12.93 23.41 13.1 23.43 13.27L33.17 3.7C33.09 3.69 33 3.69 32.92 3.69H23.39V0Z' />
    <path d='M13.77 19.1L0 3.69H5.54L13.62 12.73V3.69H17.75V17.57C17.75 19.67 15.17 20.66 13.77 19.1Z' />
  </svg>
)
