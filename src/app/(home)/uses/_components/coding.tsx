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
          as my primary editor with the{' '}
          <a
            className='font-medium text-primary hover:underline'
            href='https://marketplace.visualstudio.com/items?itemName=MohdZaid.vscode-cursor-theme'
            rel='noopener noreferrer'
            target='_blank'
          >
            Cursor theme
          </a>{' '}
          ,{' '}
          <a
            className='font-medium text-primary hover:underline'
            href='https://marketplace.visualstudio.com/items?itemName=subframe7536.custom-ui-style'
            rel='noopener noreferrer'
            target='_blank'
          >
            Custom UI Style
          </a>{' '}
          tweaks, and the{' '}
          <a
            className='font-medium text-primary hover:underline'
            href='https://www.jetbrains.com/lp/mono/'
            rel='noopener noreferrer'
            target='_blank'
          >
            JetBrains Mono
          </a>{' '}
          font with ligatures enabled. If you want the config, it lives{' '}
          <a
            className='font-medium text-primary hover:underline'
            href='https://github.com/techwithanirudh/dotfiles/blob/main/vscode/settings.json'
            rel='noopener noreferrer'
            target='_blank'
          >
            here
          </a>
          .
        </p>
      </div>

      <figure>
        <div className='border-border border-b border-dashed'>
          <Image
            alt='My VS Code setup'
            className='h-full w-full object-cover dark:hidden'
            height={720}
            src='/images/uses/vscode-light.png'
            width={1280}
          />
          <Image
            alt='My VS Code setup'
            className='hidden h-full w-full object-cover dark:block'
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
