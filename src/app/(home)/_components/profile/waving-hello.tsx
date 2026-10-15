// Greeting that cycles through languages, after jahir.dev
// (MIT, (c) Jahir Fiquitiva): https://github.com/jahirfiquitiva/jahir.dev
import { TextFlip } from '@/components/text-flip'
import { profile } from '@/constants/portfolio/profile'

export function WavingHello() {
  return (
    <div className='flex h-7 items-center gap-2 pl-4 font-mono text-muted-foreground text-xs'>
      <span
        aria-hidden
        className='inline-block origin-[70%_70%] motion-safe:animate-[wave_2.5s_ease-in-out_infinite]'
      >
        👋
      </span>
      <TextFlip interval={2.5}>
        {profile.greetings.map((greeting) => `${greeting}!`)}
      </TextFlip>
    </div>
  )
}
