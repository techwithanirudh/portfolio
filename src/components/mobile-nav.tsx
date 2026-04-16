'use client'

import { useSearchContext } from 'fumadocs-ui/contexts/search'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Icons } from '@/components/icons/icons'
import { ThemeToggle } from '@/components/sections/header/theme-toggle'
import { linkItems, socials } from '@/constants/navigation'
import { cn } from '@/lib/utils'

const PRIMARY_LINKS = [
  { href: '/', icon: <Icons.home className='size-4' />, label: 'Home' },
  { href: '/blog', icon: <Icons.user className='size-4' />, label: 'About' },
  { href: '/work', icon: <Icons.work className='size-4' />, label: 'Work' },
]

function NavItem({
  href,
  icon,
  label,
  nested,
}: {
  href: string
  icon: React.ReactNode
  label: string
  nested?: boolean
}) {
  const pathname = usePathname()
  const isActive = nested ? pathname.startsWith(href) : pathname === href

  return (
    <Link
      aria-label={label}
      className={cn(
        'flex size-8 items-center justify-center rounded-full transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:text-foreground'
      )}
      href={href}
    >
      {icon}
    </Link>
  )
}

export function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { setOpenSearch } = useSearchContext()

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className='fixed inset-0 z-[48] bg-background/60 backdrop-blur-sm sm:hidden'
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className='fixed inset-x-4 bottom-20 z-[49] rounded-2xl border bg-popover p-4 shadow-xl sm:hidden'
            exit={{ opacity: 0, y: 8 }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
          >
            <div className='mb-3 flex items-center justify-between'>
              <span className='text-muted-foreground text-xs uppercase tracking-widest'>
                Menu
              </span>
              <ThemeToggle />
            </div>
            <nav className='grid grid-cols-2 gap-1'>
              {linkItems
                .filter(
                  (item): item is typeof item & { url: string; text: string } =>
                    'url' in item && 'text' in item
                )
                .map((item) => (
                  <Link
                    className='flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted [&_svg]:size-3.5'
                    href={item.url}
                    key={item.url}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className='text-muted-foreground'>
                      {'icon' in item ? item.icon : null}
                    </span>
                    {item.text}
                  </Link>
                ))}
            </nav>
            <div className='mt-3 border-t pt-3'>
              <div className='flex flex-wrap gap-2'>
                {socials.map((s) => (
                  <a
                    aria-label={s.name}
                    className='flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5'
                    href={s.url}
                    key={s.name}
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating pill */}
      <div className='fixed inset-x-0 bottom-4 z-[49] flex justify-center sm:hidden'>
        <div className='flex items-center gap-0.5 rounded-full border bg-background/80 px-1.5 py-1.5 shadow-lg backdrop-blur-md'>
          <button
            aria-label='Search'
            className='flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground'
            onClick={() => {
              setMenuOpen(false)
              setOpenSearch(true)
            }}
            type='button'
          >
            <Icons.search className='size-4' />
          </button>

          <div className='mx-1 h-4 w-px bg-border' />

          {PRIMARY_LINKS.map((link) => (
            <NavItem
              href={link.href}
              icon={link.icon}
              key={link.href}
              label={link.label}
              nested={link.href !== '/'}
            />
          ))}

          <div className='mx-1 h-4 w-px bg-border' />

          <button
            aria-label='Toggle menu'
            className={cn(
              'flex size-8 items-center justify-center rounded-full transition-colors',
              menuOpen
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setMenuOpen((v) => !v)}
            type='button'
          >
            {menuOpen ? (
              <Icons.close className='size-4' />
            ) : (
              <Icons.menu className='size-4' />
            )}
          </button>
        </div>
      </div>
    </>
  )
}
