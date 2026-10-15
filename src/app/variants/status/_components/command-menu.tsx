// Adapted from nelsonlai.dev/src/components/command-menu.tsx (MIT, © 2025 Nelson Lai). See ../NOTICES.md
'use client'

import {
  ArrowUpRight,
  Briefcase,
  Copy,
  FileText,
  Home,
  LayoutGrid,
  Moon,
  PawPrint,
  Rss,
  Search,
  User,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Fragment, type ReactNode, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAssistantContext } from '@/components/features/assistant'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { BASE } from '../_lib/routes'

interface CommandAction {
  handleSelect: () => void | Promise<void>
  hint?: string
  icon: ReactNode
  keywords?: string[]
  title: string
}

interface CommandSection {
  actions: CommandAction[]
  name: string
}

export interface CommandData {
  email: string
  posts: { title: string; url: string; date: string }[]
  projects: { title: string; url: string; status: string; tags: string[] }[]
  socials: { name: string; url: string }[]
}

/**
 * Nelson's typed `CommandSection` model, pointed at navigation: variant
 * pages, every project and post, then actions and socials. It fills the gap
 * the code study noted (his menu has no pages or posts).
 */
export function CommandMenu({ data }: { data: CommandData }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { setOpen: setAssistantOpen } = useAssistantContext()

  function closeMenu() {
    setIsOpen(false)
  }

  function go(href: string) {
    closeMenu()
    router.push(href)
  }

  function openExternalLink(url: string) {
    closeMenu()
    window.open(url, '_blank', 'noopener')
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        // The site's own search also binds Cmd+K; inside this variant the
        // palette owns the shortcut, so stop the event before it gets there.
        event.preventDefault()
        event.stopImmediatePropagation()
        setIsOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', handleKeyDown, { capture: true })
    return () =>
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [])

  const groups: CommandSection[] = [
    {
      actions: [
        { handleSelect: () => go(BASE), icon: <Home />, title: 'Home' },
        {
          handleSelect: () => go(`${BASE}/about`),
          icon: <User />,
          keywords: ['history', 'uptime', 'incidents', 'uses'],
          title: 'About',
        },
        {
          handleSelect: () => go(`${BASE}/work`),
          icon: <Briefcase />,
          keywords: ['projects', 'components'],
          title: 'Work',
        },
        { handleSelect: () => go('/blog'), icon: <FileText />, title: 'Blog' },
        {
          handleSelect: () => go('/variants'),
          icon: <LayoutGrid />,
          title: 'All four directions',
        },
      ],
      name: 'Pages',
    },
    {
      actions: data.projects.map((p) => ({
        handleSelect: () => go(p.url),
        hint: p.status,
        icon: <Briefcase />,
        keywords: p.tags,
        title: p.title,
      })),
      name: 'Projects',
    },
    {
      actions: data.posts.map((p) => ({
        handleSelect: () => go(p.url),
        hint: p.date,
        icon: <FileText />,
        title: p.title,
      })),
      name: 'Writing',
    },
    {
      actions: [
        {
          handleSelect: () => {
            closeMenu()
            setAssistantOpen(true)
          },
          hint: '⌘ /',
          icon: <PawPrint />,
          keywords: ['chat', 'ai', 'assistant'],
          title: 'Ask Simba',
        },
        {
          handleSelect: async () => {
            closeMenu()
            await navigator.clipboard.writeText(data.email)
            toast.success('Email copied')
          },
          icon: <Copy />,
          keywords: ['contact', 'mail'],
          title: 'Copy email address',
        },
        {
          handleSelect: () => {
            closeMenu()
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
          },
          icon: <Moon />,
          keywords: ['dark', 'light', 'theme'],
          title: 'Toggle theme',
        },
        {
          handleSelect: () => openExternalLink('/rss.xml'),
          icon: <Rss />,
          keywords: ['subscribe', 'feed'],
          title: 'Subscribe via RSS',
        },
      ],
      name: 'Actions',
    },
    {
      actions: data.socials.map((s) => ({
        handleSelect: () => openExternalLink(s.url),
        icon: <ArrowUpRight />,
        title: s.name,
      })),
      name: 'Social',
    },
  ]

  return (
    <>
      <button
        aria-keyshortcuts='Meta+K Control+K'
        aria-label='Open command menu'
        className='inline-flex h-8 items-center gap-2 rounded-lg px-2 text-[13px] text-[var(--muted)] shadow-[var(--feature-card)] transition-colors hover:text-[var(--text)] sm:w-52 sm:bg-[var(--panel)] sm:px-2.5'
        onClick={() => setIsOpen(true)}
        type='button'
      >
        <Search aria-hidden className='size-4' strokeWidth={1.75} />
        <span className='hidden sm:inline'>Search</span>
        <kbd className='vs-num ml-auto hidden rounded-md bg-[var(--panel-raised)] px-1.5 py-0.5 text-[11px] sm:inline'>
          ⌘K
        </kbd>
      </button>
      <CommandDialog
        className='v-status max-w-[calc(100%-2rem)] border-0 bg-[var(--panel)] text-[var(--text)] shadow-[var(--feature-card),0_24px_64px_-12px_rgb(0_0_0/0.45)] sm:max-w-xl'
        description='Jump to a page, project or post, or run an action.'
        onOpenChange={setIsOpen}
        open={isOpen}
        title='Command menu'
      >
        <Command className='text-[var(--text)] [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-[var(--muted)] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.06em] [&_[cmdk-input-wrapper]]:h-12 [&_[data-slot=command-input-wrapper]]:h-12 [&_[data-slot=command-input-wrapper]]:border-[var(--line)]'>
          <CommandInput
            className='text-[15px] placeholder:text-[var(--muted)]'
            placeholder='Search pages, projects, posts…'
          />
          <CommandList className='max-h-[min(26rem,60vh)] px-1.5'>
            <CommandEmpty className='text-[var(--muted)]'>
              Nothing matches. Try a project name or a tag.
            </CommandEmpty>
            {groups.map((group, index) => (
              <Fragment key={group.name}>
                <CommandGroup heading={group.name}>
                  {group.actions.map((action) => (
                    <CommandItem
                      className={cn(
                        'h-10 rounded-lg font-normal text-[14px] text-[var(--text)] data-selected:border-transparent data-selected:bg-[var(--panel-raised)] [&_svg]:text-[var(--muted)]'
                      )}
                      key={`${group.name}-${action.title}`}
                      keywords={action.keywords}
                      onSelect={action.handleSelect}
                      value={`${group.name} ${action.title}`}
                    >
                      {action.icon}
                      <span className='truncate'>{action.title}</span>
                      {action.hint ? (
                        <CommandShortcut className='vs-num tracking-normal'>
                          {action.hint}
                        </CommandShortcut>
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {index === groups.length - 1 ? null : <CommandSeparator />}
              </Fragment>
            ))}
          </CommandList>
          <div className='flex items-center justify-between border-[var(--line)] border-t px-3 py-2 text-[11px] text-[var(--muted)]'>
            <span className='vs-num'>
              ↑↓ to move · ↵ to open · esc to close
            </span>
            <span className='vs-num hidden sm:inline'>status.an1rudh</span>
          </div>
        </Command>
      </CommandDialog>
    </>
  )
}
