import { BlurImage } from '@/components/blur-image'
import { PreviewLink } from '@/components/preview-link'

export function Coding() {
  return (
    <div>
      <div className='border-border border-b border-dashed p-6'>
        <p className='text-muted-foreground'>
          I use{' '}
          <PreviewLink
            className='link-underline'
            href='https://code.visualstudio.com'
          >
            Visual Studio Code
          </PreviewLink>{' '}
          as my main editor with the{' '}
          <PreviewLink
            className='link-underline'
            href='https://marketplace.visualstudio.com/items?itemName=MohdZaid.vscode-cursor-theme'
          >
            Cursor theme
          </PreviewLink>
          ,{' '}
          <PreviewLink
            className='link-underline'
            href='https://marketplace.visualstudio.com/items?itemName=subframe7536.custom-ui-style'
          >
            Custom UI Style
          </PreviewLink>{' '}
          tweaks, and the{' '}
          <PreviewLink
            className='link-underline'
            href='https://www.jetbrains.com/lp/mono/'
          >
            JetBrains Mono
          </PreviewLink>{' '}
          font with ligatures enabled. If you want the config, it lives in{' '}
          <PreviewLink
            className='link-underline'
            href='https://github.com/techwithanirudh/dotfiles/blob/main/editors/vscode/settings.json'
          >
            my dotfiles
          </PreviewLink>
          .
        </p>
      </div>

      <figure>
        <div className='border-border border-b border-dashed'>
          <BlurImage
            alt='My VS Code setup'
            className='h-full w-full dark:hidden'
            height={720}
            imageClassName='h-full w-full object-cover'
            sizes='(min-width: 1400px) 1400px, 100vw'
            src='/images/uses/vscode-light.png'
            width={1280}
          />
          <BlurImage
            alt='My VS Code setup'
            className='hidden h-full w-full dark:block'
            height={720}
            imageClassName='h-full w-full object-cover'
            sizes='(min-width: 1400px) 1400px, 100vw'
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
