import Link from 'next/link'
import { UserButton } from '@/components/features/auth'
import { Clock } from '@/components/layout/footer/clock'
import { SoundToggle } from '@/components/layout/footer/sound-toggle'
import { ThemeToggle } from '@/components/layout/header/theme-toggle'
import { ViewAnimation } from '@/components/view-animation'
import { socials } from '@/constants/navigation'
import { title } from '@/constants/site'

const links = [
  { href: '/uses', label: 'uses' },
  { href: '/colophon', label: 'colophon' },
  { href: '/rss.xml', label: 'rss' },
  { href: '/sitemap.xml', label: 'sitemap' },
]

export const Footer = () => (
  <footer className='pb-24 md:pb-0'>
    <div className='container mx-auto'>
      {/* The top rule sits 1px up so it lands on the last section's bottom
          rule instead of doubling it */}
      <div className='screen-line-top screen-line-bottom border-line border-x before:-top-px'>
        {/* Every page ends on the same hatched band before the footer */}
        <div aria-hidden className='screen-line-bottom h-8 bg-dashed' />
        <ViewAnimation
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <div className='screen-line-bottom flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 font-mono text-muted-foreground text-xs'>
            <ul className='flex flex-wrap items-center gap-x-4 gap-y-2'>
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    className='transition-colors hover:text-foreground'
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className='flex items-center gap-3 [&_svg]:size-4'>
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    aria-label={social.name}
                    className='group block transition-colors hover:text-foreground'
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
        <ViewAnimation
          delay={0.1}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
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
              <ThemeToggle mode='light-dark-system' />
            </div>
          </div>
        </ViewAnimation>
      </div>
    </div>
  </footer>
)
