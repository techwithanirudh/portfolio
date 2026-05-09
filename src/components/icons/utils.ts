import type { ComponentProps, JSX } from 'react'

export type IconProps = ComponentProps<'svg'> & {
  size?: number | string
}
export type SvgIcon = (props: IconProps) => JSX.Element
export type Icon = SvgIcon

export const getSvgSizeProps = ({
  height,
  size,
  width,
}: Pick<IconProps, 'height' | 'size' | 'width'>) => ({
  height: height ?? size ?? width ?? '1em',
  width: width ?? size ?? height ?? '1em',
})
