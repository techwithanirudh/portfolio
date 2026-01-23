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
    name: '1Password',
    description: 'Password manager',
    logo: {
      type: 'custom',
      url: {
        light: '/images/uses/software/1password-light.svg',
        dark: '/images/uses/software/1password-dark.svg',
      },
    },
    url: 'https://1password.com',
    featured: true,
  },
  {
    name: 'Alcove',
    description: 'Notch dock utility',
    url: 'https://tryalcove.com',
  },
  {
    name: 'Amphetamine',
    description: 'Keeps Mac awake',
    url: 'https://apps.apple.com/app/amphetamine/id937984704',
  },
  {
    name: 'Antinote',
    description: 'Quick notes',
    url: 'https://antinote.io',
  },
  {
    name: 'Bartender',
    description: 'Menu bar organizer',
    url: 'https://www.macbartender.com',
  },
  {
    name: 'Beeper',
    description: 'Unified messaging',
    url: 'https://www.beeper.com',
  },
  {
    name: 'BetterDisplay',
    description: 'Display management',
    url: 'https://betterdisplay.pro',
  },
  {
    name: 'CleanShot X',
    description: 'Screen capture and recording',
    url: 'https://cleanshot.com',
  },
  {
    name: 'Claude Code',
    description: 'AI coding assistant',
    url: 'https://www.anthropic.com/claude-code',
  },
  {
    name: 'Conductor',
    description: 'Utility app',
    url: 'https://conductor.build',
  },
  {
    name: 'Craft',
    description: 'Notes and documents',
    url: 'https://www.craft.do',
  },
  {
    name: 'Dia',
    description: 'Browser',
    url: 'https://diabrowser.com',
  },
  {
    name: 'Downie',
    description: 'Video downloader',
    url: 'https://software.charliemonroe.net/downie/',
  },
  {
    name: 'Dropover',
    description: 'Drag and drop shelf',
    url: 'https://dropoverapp.com',
  },
  {
    name: 'Ghostty',
    description: 'Terminal emulator',
    logo: { type: 'custom', url: '/images/uses/software/ghostty.svg' },
    url: 'https://ghostty.org',
  },
  {
    name: 'Goodnotes',
    description: 'Digital notebook',
    url: 'https://www.goodnotes.com',
  },
  {
    name: 'IINA',
    description: 'Media player',
    url: 'https://iina.io',
  },
  {
    name: 'LookAway',
    description: 'Break reminders',
    url: 'https://lookaway.app',
  },
  {
    name: 'Loop',
    description: 'Window manager',
    url: 'https://github.com/MrKai77/Loop',
  },
  {
    name: 'Mole',
    description: 'Volume control per app',
    url: 'https://github.com/tw93/Mole',
  },
  {
    name: 'Notion',
    description: 'Notes and docs',
    logo: { type: 'custom', url: '/images/uses/software/notion.svg' },
    url: 'https://www.notion.com',
    featured: true,
  },
  {
    name: 'Notion Calendar',
    description: 'Calendar client',
    url: 'https://www.notion.com/product/calendar',
  },
  {
    name: 'OpenCode',
    description: 'Coding assistant',
    url: 'https://opencode.ai',
  },
  {
    name: 'OrbStack',
    description: 'Containers and Linux VMs',
    url: 'https://orbstack.dev',
  },
  {
    name: 'Paste',
    description: 'Clipboard manager',
    url: 'https://pasteapp.io',
  },
  {
    name: 'Pictogram',
    description: 'Utility app',
    url: 'https://pictogramapp.com',
  },
  {
    name: 'PixelSnap',
    description: 'Screen measuring tool',
    url: 'https://pixelsnap.com',
  },
  {
    name: 'Raindrop.io',
    description: 'Bookmark manager',
    logo: { type: 'custom', url: '/images/uses/software/raindrop.svg' },
    url: 'https://raindrop.io',
  },
  {
    name: 'Raycast',
    description: 'Productivity launcher',
    logo: { type: 'custom', url: '/images/uses/software/raycast.svg' },
    url: 'https://raycast.com',
    featured: true,
  },
  {
    name: 'Spark Mail',
    description: 'Email client',
    url: 'https://sparkmailapp.com',
  },
  {
    name: 'Spotify',
    description: 'Music streaming',
    logo: { type: 'custom', url: '/images/uses/software/spotify.svg' },
    url: 'https://spotify.com',
  },
  {
    name: 'Supercharge',
    description: 'Mac productivity utilities',
    url: 'https://sindresorhus.com/supercharge',
  },
  {
    name: 'Termius',
    description: 'SSH client',
    url: 'https://termius.com',
  },
  {
    name: 'Typefully',
    description: 'Writing and scheduling tool',
    url: 'https://typefully.com',
  },
  {
    name: 'UTM',
    description: 'Virtual machines',
    url: 'https://mac.getutm.app',
  },
  {
    name: 'Vesktop',
    description: 'Discord client',
    url: 'https://vesktop.dev',
  },
  {
    name: 'Visual Studio Code',
    description: 'Code editor',
    logo: { type: 'custom', url: '/images/uses/software/vscode.svg' },
    url: 'https://code.visualstudio.com',
    featured: true,
  },
  {
    name: 'Warp',
    description: 'Terminal',
    logo: { type: 'custom', url: '/images/uses/software/warp.svg' },
    url: 'https://warp.dev',
  },
  {
    name: 'Wispr Flow',
    description: 'Voice dictation',
    url: 'https://wisprflow.ai',
  },
  {
    name: 'Yaak',
    description: 'API client',
    url: 'https://yaak.app',
  },
]
