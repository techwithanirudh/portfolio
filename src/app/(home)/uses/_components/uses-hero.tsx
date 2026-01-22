import Image from 'next/image'

interface UsesHeroProps {
  imageSrc: string
  caption: string
}

export function UsesHero({ imageSrc, caption }: UsesHeroProps) {
  return (
    <figure>
      <div className='aspect-video overflow-hidden border-border border-b border-dashed'>
        <Image
          alt={caption}
          className='h-full w-full object-cover'
          height={720}
          priority
          src={imageSrc}
          width={1280}
        />
      </div>
      <figcaption className='p-4 text-center text-muted-foreground text-sm'>
        {caption}
      </figcaption>
    </figure>
  )
}
