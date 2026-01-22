import Image from 'next/image'

const coding = {
  editor: {
    name: 'Visual Studio Code',
    url: 'https://code.visualstudio.com',
  },
  theme: {
    name: 'GitHub Dark',
    url: 'https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme',
  },
  font: {
    name: 'JetBrains Mono',
    url: 'https://www.jetbrains.com/lp/mono/',
  },
  screenshot: '/images/uses/vscode-setup.png',
} as const

export function Coding() {
  return (
    <div>
      <div className='border-border border-b border-dashed p-6'>
        <p className='text-muted-foreground'>
          I use{' '}
          <a
            className='font-medium text-primary hover:underline'
            href={coding.editor.url}
            rel='noopener noreferrer'
            target='_blank'
          >
            {coding.editor.name}
          </a>{' '}
          as my primary editor, along with the{' '}
          <a
            className='font-medium text-primary hover:underline'
            href={coding.theme.url}
            rel='noopener noreferrer'
            target='_blank'
          >
            {coding.theme.name}
          </a>{' '}
          theme and the{' '}
          <a
            className='font-medium text-primary hover:underline'
            href={coding.font.url}
            rel='noopener noreferrer'
            target='_blank'
          >
            {coding.font.name}
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
            src={coding.screenshot}
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
