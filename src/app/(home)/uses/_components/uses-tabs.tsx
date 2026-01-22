'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { UsesTab, UsesTabId } from '@/types'

interface UsesTabsProps {
  tabs: UsesTab[]
  activeTab: UsesTabId
  onTabChange: (tab: UsesTabId) => void
}

export function UsesTabs({ tabs, activeTab, onTabChange }: UsesTabsProps) {
  return (
    <div
      className='flex gap-1 overflow-x-auto border-border border-dashed'
      role='tablist'
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            aria-controls={`tab-${tab.id}-content`}
            aria-selected={isActive}
            className={cn(
              'relative shrink-0 px-4 py-3 font-medium text-sm transition-colors',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
            id={`tab-${tab.id}`}
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            role='tab'
            type='button'
          >
            {tab.title}
            {isActive && (
              <span className='absolute bottom-0 left-0 h-0.5 w-full bg-primary' />
            )}
          </button>
        )
      })}
    </div>
  )
}

export function useUsesTab(defaultTab: UsesTabId = 'all') {
  const [activeTab, setActiveTab] = useState<UsesTabId>(defaultTab)

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (hash && ['all', 'hardware', 'software', 'coding'].includes(hash)) {
      setActiveTab(hash as UsesTabId)
    }
  }, [])

  const handleTabChange = (tab: UsesTabId) => {
    setActiveTab(tab)
    window.history.replaceState(null, '', tab === 'all' ? '#' : `#${tab}`)
  }

  return { activeTab, handleTabChange }
}
