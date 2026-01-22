import type { HardwareItem, SoftwareItem, UsesTab } from '@/types'

export const usesTabs: UsesTab[] = [
  { id: 'all', title: 'All' },
  { id: 'hardware', title: 'Hardware' },
  { id: 'software', title: 'Software' },
  { id: 'coding', title: 'Coding' },
]

export const hardware: HardwareItem[] = [
  {
    name: 'MacBook Pro 14"',
    description: 'M3 Pro, 18GB RAM, 512GB SSD',
    url: 'https://www.apple.com/macbook-pro',
    image: '/images/uses/macbook.png',
  },
  {
    name: 'LG 27" 4K Monitor',
    description: '27UK850-W with USB-C',
    url: 'https://www.lg.com/monitors',
    image: '/images/uses/monitor.png',
  },
  {
    name: 'Keychron K3 Pro',
    description: 'Low-profile mechanical keyboard',
    url: 'https://www.keychron.com/products/keychron-k3-pro-qmk-via-wireless-custom-mechanical-keyboard',
    image: '/images/uses/keyboard.png',
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Wireless mouse for Mac',
    url: 'https://www.logitech.com/products/mice/mx-master-3s.html',
    image: '/images/uses/mouse.png',
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Noise cancelling headphones',
    url: 'https://www.sony.com/electronics/headband-headphones/wh-1000xm5',
    image: '/images/uses/headphones.png',
  },
  {
    name: 'AirPods Pro',
    description: '2nd Gen with USB-C',
    url: 'https://www.apple.com/airpods-pro',
    image: '/images/uses/airpods.png',
  },
  {
    name: 'iPhone 15 Pro',
    description: 'Natural Titanium, 256GB',
    url: 'https://www.apple.com/iphone-15-pro',
    image: '/images/uses/iphone.png',
  },
  {
    name: 'iPad Pro 11"',
    description: 'M2 chip with Apple Pencil',
    url: 'https://www.apple.com/ipad-pro',
    image: '/images/uses/ipad.png',
  },
]

export const software: SoftwareItem[] = [
  {
    name: 'VS Code',
    description: 'Primary code editor',
    logo: { type: 'svgl', id: 'vscode' },
    url: 'https://code.visualstudio.com',
    featured: true,
  },
  {
    name: 'Warp',
    description: 'Modern terminal',
    logo: { type: 'svgl', id: 'warp' },
    url: 'https://warp.dev',
  },
  {
    name: 'GitHub',
    description: 'Version control',
    logo: { type: 'svgl', id: { light: 'github_dark', dark: 'github_light' } },
    url: 'https://github.com',
    featured: true,
  },
  {
    name: 'Vercel',
    description: 'Deployment platform',
    logo: { type: 'svgl', id: { light: 'vercel_dark', dark: 'vercel' } },
    url: 'https://vercel.com',
    featured: true,
  },
  {
    name: 'Figma',
    description: 'Design tool',
    logo: { type: 'svgl', id: 'figma' },
    url: 'https://figma.com',
    featured: true,
  },
  {
    name: 'Notion',
    description: 'Notes & docs',
    logo: { type: 'svgl', id: 'notion' },
    url: 'https://notion.so',
    featured: true,
  },
  {
    name: 'Linear',
    description: 'Issue tracking',
    logo: { type: 'svgl', id: 'linear' },
    url: 'https://linear.app',
  },
  {
    name: 'Raycast',
    description: 'Productivity launcher',
    logo: { type: 'svgl', id: 'raycast' },
    url: 'https://raycast.com',
    featured: true,
  },
  {
    name: 'Arc',
    description: 'Browser',
    logo: { type: 'svgl', id: 'arc_browser' },
    url: 'https://arc.net',
  },
  {
    name: 'Claude',
    description: 'AI assistant',
    logo: { type: 'svgl', id: 'claude-ai-icon' },
    url: 'https://claude.ai',
    featured: true,
  },
  {
    name: 'Discord',
    description: 'Communication',
    logo: { type: 'svgl', id: 'discord' },
    url: 'https://discord.com',
  },
  {
    name: 'Slack',
    description: 'Team chat',
    logo: { type: 'svgl', id: 'slack' },
    url: 'https://slack.com',
  },
]

export const coding = {
  editor: {
    name: 'Visual Studio Code',
    url: 'https://code.visualstudio.com',
  },
  theme: {
    name: 'GitHub Dark',
    url: 'https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme',
  },
  font: {
    name: 'JetBrains Mono',
    url: 'https://www.jetbrains.com/lp/mono/',
  },
  screenshot: '/images/uses/vscode-setup.png',
}
