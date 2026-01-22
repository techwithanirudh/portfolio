import type { HardwareItem, SoftwareItem } from '@/types'

export const hardware: HardwareItem[] = [
  {
    name: 'MacBook Air 15"',
    description: 'M2 chip, 8GB RAM, 256GB SSD',
    url: 'https://www.apple.com/macbook-air',
    image: '/images/uses/hardware/macbook.png',
  },
  {
    name: 'Mac mini',
    description: 'M4 chip, 16GB RAM, 256GB SSD',
    url: 'https://www.apple.com/mac-mini',
  },
  {
    name: 'Lenovo Server',
    description: 'Intel i5, 32GB RAM, Proxmox VE',
  },
  {
    name: 'Samsung M7 Smart Monitor',
    description: '4K UHD smart monitor',
    url: 'https://www.samsung.com/monitors',
    image: '/images/uses/hardware/monitor.png',
  },
  {
    name: 'Logitech MX Mechanical Mini',
    description: 'Low-profile mechanical keyboard',
    url: 'https://www.logitech.com/products/keyboards/mx-mechanical-mini.html',
    image: '/images/uses/hardware/keyboard.png',
  },
  {
    name: 'Marshall Major V',
    description: 'Wireless on-ear headphones',
    url: 'https://www.marshallheadphones.com',
    image: '/images/uses/hardware/headphones.png',
  },
  {
    name: 'iPhone 16 Pro',
    description: 'Desert Titanium, 256GB',
    url: 'https://www.apple.com/iphone-16-pro',
    image: '/images/uses/hardware/iphone.png',
  },
  {
    name: 'iPad 10th Gen',
    description: 'Axyz with Apple Pencil (1st gen)',
    url: 'https://www.apple.com/ipad-10.9',
    image: '/images/uses/hardware/ipad.png',
  },
  {
    name: 'Apple Watch Series 9',
    description: '45mm',
    url: 'https://www.apple.com/apple-watch-series-9',
  },
  {
    name: 'Raspberry Pi 5',
    description: '16GB RAM with SSD HAT and metal enclosure',
    url: 'https://www.raspberrypi.com/products/raspberry-pi-5',
  },
]

export const software: SoftwareItem[] = [
  {
    name: 'VS Code',
    description: 'Primary code editor',
    logo: { type: 'custom', url: '/images/uses/software/vscode.svg' },
    url: 'https://code.visualstudio.com',
    featured: true,
  },
  {
    name: 'Warp',
    description: 'Modern terminal',
    logo: { type: 'custom', url: '/images/uses/software/warp.svg' },
    url: 'https://warp.dev',
  },
  {
    name: 'GitHub',
    description: 'Version control',
    logo: {
      type: 'custom',
      url: {
        light: '/images/uses/software/github_light.svg',
        dark: '/images/uses/software/github_dark.svg',
      },
    },
    url: 'https://github.com',
    featured: true,
  },
  {
    name: 'Vercel',
    description: 'Deployment platform',
    logo: {
      type: 'custom',
      url: {
        light: '/images/uses/software/vercel.svg',
        dark: '/images/uses/software/vercel_dark.svg',
      },
    },
    url: 'https://vercel.com',
    featured: true,
  },
  {
    name: 'Figma',
    description: 'Design tool',
    logo: { type: 'custom', url: '/images/uses/software/figma.svg' },
    url: 'https://figma.com',
    featured: true,
  },
  {
    name: 'Notion',
    description: 'Notes & docs',
    logo: { type: 'custom', url: '/images/uses/software/notion.svg' },
    url: 'https://notion.so',
    featured: true,
  },
  {
    name: 'Linear',
    description: 'Issue tracking',
    logo: { type: 'custom', url: '/images/uses/software/linear.svg' },
    url: 'https://linear.app',
  },
  {
    name: 'Raycast',
    description: 'Productivity launcher',
    logo: { type: 'custom', url: '/images/uses/software/raycast.svg' },
    url: 'https://raycast.com',
    featured: true,
  },
  {
    name: 'Arc',
    description: 'Browser',
    logo: { type: 'custom', url: '/images/uses/software/arc_browser.svg' },
    url: 'https://arc.net',
  },
  {
    name: 'Claude',
    description: 'AI assistant',
    logo: { type: 'custom', url: '/images/uses/software/claude-ai-icon.svg' },
    url: 'https://claude.ai',
    featured: true,
  },
  {
    name: 'Discord',
    description: 'Communication',
    logo: { type: 'custom', url: '/images/uses/software/discord.svg' },
    url: 'https://discord.com',
  },
  {
    name: 'Slack',
    description: 'Team chat',
    logo: { type: 'custom', url: '/images/uses/software/slack.svg' },
    url: 'https://slack.com',
  },
]
