import Image from 'next/image'

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
          <Image
            alt='My desk setup in 2025'
            className='w-full object-cover h-full grayscale-75 transition-filter hover:grayscale-0 duration-300'
            height={720}
            priority
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
