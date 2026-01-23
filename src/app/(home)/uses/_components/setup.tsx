import { BlurImage } from '@/components/blur-image'

export function Setup() {
  return (
    <div>
      <div className='border-border border-b border-dashed p-6'>
        <p className='text-muted-foreground'>
          A cozy workspace built for focus, with the gear I rely on every day.
        </p>
      </div>
      <figure>
        <div className='overflow-hidden border-border border-b border-dashed'>
          <BlurImage
            alt='My desk setup in 2025'
            className='h-full w-full'
            height={720}
            imageClassName='h-full w-full object-cover grayscale-75 transition-filter duration-300 hover:grayscale-0'
            lazy={false}
            src='/images/uses/setup.png'
            width={1280}
          />
        </div>
        <figcaption className='p-4 text-center text-muted-foreground text-sm'>
          My desk setup in 2025
        </figcaption>
      </figure>
    </div>
  )
}
