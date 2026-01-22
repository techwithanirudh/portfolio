import Image from 'next/image'

interface CodingConfig {
  editor: { name: string; url: string }
  theme: { name: string; url: string }
  font: { name: string; url: string }
  screenshot: string
}

interface CodingSectionProps {
  config: CodingConfig
}

export function CodingSection({ config }: CodingSectionProps) {
  return (
    <div>
      <div className='border-border border-b border-dashed p-6'>
        <p className='text-muted-foreground'>
          I use{' '}
          <a
            className='font-medium text-primary hover:underline'
            href={config.editor.url}
            rel='noopener noreferrer'
            target='_blank'
          >
            {config.editor.name}
          </a>{' '}
          as my primary editor, along with the{' '}
          <a
            className='font-medium text-primary hover:underline'
            href={config.theme.url}
            rel='noopener noreferrer'
            target='_blank'
          >
            {config.theme.name}
          </a>{' '}
          theme and the{' '}
          <a
            className='font-medium text-primary hover:underline'
            href={config.font.url}
            rel='noopener noreferrer'
            target='_blank'
          >
            {config.font.name}
          </a>{' '}
          font with ligatures enabled.
        </p>
      </div>

      <figure>
        <div className='border-border border-b border-dashed'>
          <Image
            alt='My VS Code setup'
            className='w-full'
            height={720}
            src={config.screenshot}
            width={1280}
          />
        </div>
        <figcaption className='p-4 text-center text-muted-foreground text-sm'>
          My VS Code configuration
        </figcaption>
      </figure>
    </div>
  )
}
