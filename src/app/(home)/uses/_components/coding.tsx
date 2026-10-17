import { BlurImage } from '@/components/blur-image'
import { InlineMarkdown } from '@/components/inline-markdown'
import { codingSetup } from '@/constants/portfolio/uses'

export function Coding() {
  return (
    <div>
      <div className='border-border border-b border-dashed p-6'>
        <p className='text-muted-foreground'>
          <InlineMarkdown linkClassName='link-underline' text={codingSetup} />
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
