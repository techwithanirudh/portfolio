import Image from 'next/image'

export function Coding() {
  return (
    <div>
      <div className='border-border border-b border-dashed p-6'>
        <p className='text-muted-foreground'>
          I use{' '}
          <a
            className='font-medium text-primary hover:underline'
            href='https://code.visualstudio.com'
            rel='noopener noreferrer'
            target='_blank'
          >
            Visual Studio Code
          </a>{' '}
          as my primary editor, along with the{' '}
          <a
            className='font-medium text-primary hover:underline'
            href='https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme'
            rel='noopener noreferrer'
            target='_blank'
          >
            GitHub Dark
          </a>{' '}
          theme and the{' '}
          <a
            className='font-medium text-primary hover:underline'
            href='https://www.jetbrains.com/lp/mono/'
            rel='noopener noreferrer'
            target='_blank'
          >
            JetBrains Mono
          </a>{' '}
          font with ligatures enabled.
        </p>
      </div>

      <figure>
        <div className='border-border border-b border-dashed'>
          <Image
            alt='My VS Code setup'
            className='w-full object-cover h-full dark:hidden'
            height={720}
            src='/images/uses/vscode-light.png'
            width={1280}
          />
          <Image
            alt='My VS Code setup'
            className='hidden w-full object-cover h-full dark:block'
            height={720}
            src='/images/uses/vscode-dark.png'
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
