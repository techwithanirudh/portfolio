import type { LinkItemType } from 'fumadocs-ui/layouts/shared'

export const splitLinkItems = (items: LinkItemType[]) => {
  const navItems: LinkItemType[] = []
  const menuItems: LinkItemType[] = []

  for (const item of items) {
    switch (item.on ?? 'all') {
      case 'menu':
        menuItems.push(item)
        break
      case 'nav':
        navItems.push(item)
        break
      default:
        navItems.push(item)
        menuItems.push(item)
    }
  }

  return { menuItems, navItems }
}
