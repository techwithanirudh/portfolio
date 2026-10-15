// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import { profile } from '@/constants/portfolio/profile'
import { HeroName, HeroNameHint } from '../hero-name'
import { FlipSentences } from './flip-sentences'
import { Portrait } from './portrait'
import { WavingHello } from './waving-hello'

export function ProfileHeader() {
  return (
    <div className='screen-line-bottom grid grid-cols-[auto_1fr] border-line border-x'>
      <div className='shrink-0 border-line border-r'>
        <div className='m-1'>
          <div className='relative size-28 overflow-hidden rounded-[0.875rem] sm:size-36'>
            <Portrait />
            <div className='pointer-events-none absolute inset-0 inset-ring-1 inset-ring-foreground/15 rounded-[inherit] dark:inset-ring-foreground/10' />
          </div>
        </div>
      </div>

      <div className='flex min-w-0 flex-col justify-end'>
        <WavingHello />
        <div className='flex items-center gap-2 border-line border-t pl-4'>
          <h1 className='-translate-y-px font-normal text-[2rem]/none tracking-tighter sm:text-[2.5rem]/none'>
            <HeroName />
          </h1>
          <HeroNameHint />
        </div>
        <FlipSentences className='h-10 border-line border-t pl-4'>
          {profile.flipSentences}
        </FlipSentences>
      </div>
    </div>
  )
}
