import type { HardwareItem, SoftwareItem } from '@/types'

export const hardware: HardwareItem[] = [
  {
    name: 'MacBook Air 15"',
    description: 'M2 chip, 8GB RAM, 256GB SSD',
    url: 'https://support.apple.com/en-gb/111346',
    image: '/images/uses/hardware/macbook-air.png',
  },
  {
    name: 'Mac mini',
    description: 'M4 chip, 16GB RAM, 256GB SSD',
    url: 'https://support.apple.com/en-in/121555',
    image: '/images/uses/hardware/mac-mini.png',
  },
  {
    name: 'ThinkCentre M70q',
    description: 'Intel i5, 32GB RAM, 1TB SSD, Proxmox VE',
    url: 'https://www.lenovo.com/in/en/p/desktops/thinkcentre/m-series-tiny/lenovo-thinkcentre-m70q-gen-5-tiny-intel/12tqcto1wwin1',
    image: '/images/uses/hardware/lenovo-server.png',
  },
  {
    name: 'Samsung M7 Smart Monitor',
    description: 'White, 32-inch, 4K UHD smart monitor',
    url: 'https://www.samsung.com/in/monitors/smart/smart-monitor-m7-32-inch-smart-tv-apps-4k-uhd-ls32fm700uwxxl/',
    image: '/images/uses/hardware/smart-monitor.png',
  },
  {
    name: 'Logitech MX Mechanical Mini',
    description: 'For Mac, Pale Gray, tactile quiet switches',
    url: 'https://www.logitech.com/products/keyboards/mx-mechanical-mini.html',
    image: '/images/uses/hardware/mx-mechanical-mini.png',
  },
  {
    name: 'Logitech Signature M650',
    description: 'Off-white wireless mouse',
    url: 'https://www.logitech.com/products/mice/signature-m650.html',
    image: '/images/uses/hardware/m650-off-white.png',
  },
  {
    name: 'Logitech Brio 300',
    description: 'Off-white USB webcam',
    url: 'https://www.logitech.com/products/webcams/brio-300-webcam.html',
    image: '/images/uses/hardware/brio-300.png',
  },
  {
    name: 'Marshall Major V',
    description: 'Black wireless on-ear headphones',
    url: 'https://www.marshall.com/us/en/product/major-v',
    image: '/images/uses/hardware/major-v.png',
  },
  {
    name: 'iPhone 16 Pro',
    description: 'Desert Titanium, 256GB',
    url: 'https://support.apple.com/en-in/111840',
    image: '/images/uses/hardware/iphone-16-pro.png',
  },
  {
    name: 'iPad 10th Gen',
    description:
      'Silver, 128GB, Wi-Fi + Cellular, Apple Pencil, Magic Keyboard Folio',
    url: 'https://support.apple.com/en-in/111833',
    image: '/images/uses/hardware/ipad.png',
  },
  {
    name: 'Apple Watch Series 9',
    description: '45mm, Starlight, Sport Loop',
    url: 'https://support.apple.com/en-us/121031',
    image: '/images/uses/hardware/apple-watch.png',
  },
  {
    name: 'IKEA Lighting',
    description: 'IKEA MITTLED, TRADFRI driver with RODRET button',
    url: 'https://www.ikea.com/in/en/p/mittled-led-kitchen-worktop-lighting-strip-dimmable-white-20455424/',
    image: '/images/uses/hardware/mittled.png',
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
