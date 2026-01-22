import Image from 'next/image'

const deskSetup = {
  description:
    'A cozy workspace built for focus, with the gear I rely on every day.',
  imageSrc: '/images/uses/desk-setup.jpg',
  caption: 'My desk setup in 2025',
} as const

export function DeskSetup() {
  return (
    <div>
      <div className='border-border border-b border-dashed p-6'>
        <p className='text-muted-foreground'>{deskSetup.description}</p>
      </div>
      <figure>
        <div className='aspect-video overflow-hidden border-border border-b border-dashed'>
          <Image
            alt={deskSetup.caption}
            className='h-full w-full object-cover'
            height={720}
            priority
            src={deskSetup.imageSrc}
            width={1280}
          />
        </div>
        <figcaption className='p-4 text-center text-muted-foreground text-sm'>
          {deskSetup.caption}
        </figcaption>
      </figure>
    </div>
  )
}
