'use client'

import { useSearchContext } from 'fumadocs-ui/contexts/search'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAISearchContext } from '@/components/ai/chat'
import { Icons } from '@/components/icons/icons'
import { ThemeToggle } from '@/components/sections/header/theme-toggle'
import { linkItems, socials } from '@/constants/navigation'
import { isActive } from '@/lib/is-active'
import { cn } from '@/lib/utils'

const PRIMARY_LINKS = [
  { href: '/', icon: <Icons.home className='size-4' />, label: 'Home' },
  { href: '/about', icon: <Icons.user className='size-4' />, label: 'About' },
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
  const active = isActive(href, pathname, nested)

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      className={cn(
        'flex size-8 items-center justify-center rounded-full transition-colors',
        active
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
  const { setOpen: setOpenAI } = useAISearchContext()
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className='fixed inset-0 z-20 bg-background/60 backdrop-blur-sm sm:hidden'
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
            className='fixed inset-x-4 bottom-20 z-30 overflow-hidden rounded-xl border border-dashed bg-background sm:hidden'
            exit={{ opacity: 0, y: 8 }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
          >
            <nav className='grid grid-cols-2'>
              {(() => {
                const items = [
                  {
                    url: '/',
                    text: 'Home',
                    icon: <Icons.home />,
                    active: 'url' as const,
                  },
                  ...linkItems,
                ].filter(
                  (item): item is typeof item & { url: string; text: string } =>
                    'url' in item && 'text' in item
                )

                return items.map((item, index) => {
                  const activeType =
                    'active' in item ? (item.active ?? 'url') : 'url'
                  const active =
                    activeType !== 'none' &&
                    isActive(item.url, pathname, activeType === 'nested-url')
                  const isLeftCol = index % 2 === 0
                  const isLastRow = index >= items.length - 2

                  return (
                    <Link
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3 text-sm transition-[background-color,color,opacity] hover:bg-muted [&_svg]:size-3.5',
                        isLeftCol &&
                          'border-r border-dashed [border-color:var(--color-border)]',
                        !isLastRow &&
                          'border-b border-dashed [border-color:var(--color-border)]',
                        active
                          ? 'font-medium text-primary'
                          : 'text-muted-foreground'
                      )}
                      href={item.url}
                      key={item.url}
                      onClick={() => setMenuOpen(false)}
                    >
                      {'icon' in item ? item.icon : null}
                      {item.text}
                    </Link>
                  )
                })
              })()}
            </nav>
            <div className='flex items-center justify-between border-t border-dashed px-3 py-2'>
              <div className='flex items-center'>
                {socials.map((s) => (
                  <a
                    aria-label={s.name}
                    className='flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5'
                    href={s.url}
                    key={s.name}
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
              <div className='flex items-center gap-1'>
                <button
                  aria-label='Ask AI'
                  className='flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5'
                  onClick={() => {
                    setMenuOpen(false)
                    setOpenAI(true)
                  }}
                  type='button'
                >
                  <Icons.aiChat />
                </button>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating pill */}
      <div className='fixed inset-x-0 bottom-4 z-30 flex justify-center sm:hidden'>
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
              'relative flex size-8 items-center justify-center rounded-full transition-colors',
              menuOpen
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setMenuOpen((v) => !v)}
            type='button'
          >
            <AnimatePresence initial={false} mode='popLayout'>
              <motion.span
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
                initial={{ opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
                key={menuOpen ? 'close' : 'menu'}
                transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
              >
                {menuOpen ? (
                  <Icons.close className='size-4' />
                ) : (
                  <Icons.menu className='size-4' />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </>
  )
}
