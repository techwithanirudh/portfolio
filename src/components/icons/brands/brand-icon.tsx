import type { ReactNode } from 'react'
import type { IconProps, SvgIcon } from '../utils'
import { getSvgSizeProps, isLabelled } from '../utils'

export const brandIcon = (viewBox: string, paths: ReactNode): SvgIcon => {
  const Brand = ({ height, size, width, ...props }: IconProps) => (
    <svg
      aria-hidden={isLabelled(props) ? undefined : true}
      fill='currentColor'
      focusable='false'
      viewBox={viewBox}
      xmlns='http://www.w3.org/2000/svg'
      {...getSvgSizeProps({ height, size, width })}
      {...props}
    >
      {paths}
    </svg>
  )

  return Brand
}
