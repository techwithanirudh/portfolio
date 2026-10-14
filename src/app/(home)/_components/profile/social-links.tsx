'use client'

// Adapted from chanhdai.com (MIT, (c) Chanh Dai): https://github.com/ncdai/chanhdai.com
import { Panel, PanelContent } from '@/components/layout/panel'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { socials } from '@/constants/navigation'

export function SocialLinks() {
  return (
    <Panel>
      <h2 className='sr-only'>Social links</h2>
      <PanelContent>
        <ul className='flex flex-wrap gap-2'>
          {socials.map((social) => (
            <li key={social.name}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      className="text-foreground/80 shadow-none [&_svg:not([class*='size-'])]:size-4"
                      nativeButton={false}
                      render={
                        <a
                          data-sound-hover
                          href={social.url}
                          rel='noopener noreferrer'
                          target={
                            social.url.startsWith('http') ? '_blank' : undefined
                          }
                        >
                          {social.icon}
                          <span className='sr-only'>{social.name}</span>
                        </a>
                      }
                      size='icon-sm'
                      variant='outline'
                    />
                  }
                />
                <TooltipContent>{social.description}</TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  )
}
