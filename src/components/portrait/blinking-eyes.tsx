import { PORTRAIT_EYE_PATHS } from '@/lib/portrait-eyes'

export const BlinkingEyes = ({ fill }: { fill?: string }) => (
  <g
    className='[&>path]:origin-center [&>path]:animate-blink [&>path]:[transform-box:fill-box] motion-reduce:[&>path]:animate-none'
    fill={fill}
  >
    {PORTRAIT_EYE_PATHS.map((d) => (
      <path d={d} key={d} />
    ))}
  </g>
)
