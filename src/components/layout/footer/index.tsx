import Link from 'next/link'
import { UserButton } from '@/components/features/auth'
import { Clock } from '@/components/layout/footer/clock'
import { GuestbookNote } from '@/components/layout/footer/guestbook-note'
import { SoundToggle } from '@/components/layout/footer/sound-toggle'
import { ThemeToggle } from '@/components/layout/header/theme-toggle'
import { ViewAnimation } from '@/components/view-animation'
import { socials } from '@/constants/navigation'
import { title } from '@/constants/site'

// Feeds are route handlers, the client router would 404 on them
const links = [
  { href: '/guestbook', label: 'guestbook' },
  { href: '/uses', label: 'uses' },
  { href: '/colophon', label: 'colophon' },
  { document: true, href: '/rss.xml', label: 'rss' },
  { document: true, href: '/sitemap.xml', label: 'sitemap' },
]

export const Footer = () => (
  <footer className='relative z-20 bg-background pb-24 md:pb-0'>
    <div className='container mx-auto'>
      {/* 1px up so the top rule lands on the last section's bottom rule */}
      <div className='screen-line-top screen-line-bottom border-line border-x before:-top-px'>
        <GuestbookNote />
        <ViewAnimation>
          <div className='screen-line-bottom flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 font-mono text-muted-foreground text-xs'>
            <ul className='flex flex-wrap items-center gap-x-4 gap-y-2'>
              {links.map((link) => (
                <li key={link.href}>
                  {link.document ? (
                    <a
                      className='transition-colors hover:text-foreground'
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      className='transition-colors hover:text-foreground'
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <ul className='-mx-1 flex items-center gap-1 [&_svg]:size-4'>
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    aria-label={social.name}
                    className='group flex size-7 items-center justify-center transition-colors hover:text-foreground'
                    href={social.url}
                    rel='noopener noreferrer'
                    target={
                      social.url.startsWith('http') ? '_blank' : undefined
                    }
                  >
                    <span className='icon-tilt block'>{social.icon}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </ViewAnimation>
        <ViewAnimation delay={0.1}>
          <div className='flex flex-wrap items-center justify-between gap-3 px-4 py-3'>
            <div className='flex items-center gap-3'>
              <UserButton />
              <p className='font-mono text-muted-foreground text-xs'>
                &copy; {new Date().getFullYear()} {title}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <Clock />
              <SoundToggle />
              <ThemeToggle />
            </div>
          </div>
        </ViewAnimation>
      </div>
    </div>
  </footer>
)
