import type { HardwareItem, SoftwareItem } from '@/types'

const hardwareImage = (file: string) => `/images/uses/hardware/${file}`
const softwareLogo = (file: string) => `/images/uses/software/${file}`
const themedSoftwareLogo = (light: string, dark: string) => ({
  dark: softwareLogo(dark),
  light: softwareLogo(light),
})

export const hardware: HardwareItem[] = [
  {
    description: 'M2 chip, 8GB RAM, 256GB SSD',
    image: hardwareImage('macbook-air.png'),
    name: 'MacBook Air 15"',
    url: 'https://support.apple.com/en-us/111346',
  },
  {
    description: 'M4 chip, 16GB RAM, 256GB SSD',
    image: hardwareImage('mac-mini.png'),
    name: 'Mac mini',
    url: 'https://support.apple.com/en-us/121555',
  },
  {
    description: 'Intel i5, 32GB RAM, 1TB SSD, Proxmox VE',
    image: hardwareImage('lenovo-server.png'),
    name: 'ThinkCentre M70q',
    url: 'https://www.lenovo.com/in/en/p/desktops/thinkcentre/m-series-tiny/lenovo-thinkcentre-m70q-gen-5-tiny-intel/12tqcto1wwin1',
  },
  {
    description: 'White, 32-inch, 4K UHD smart monitor',
    image: hardwareImage('smart-monitor.png'),
    name: 'Samsung M7 Smart Monitor',
    url: 'https://www.samsung.com/in/monitors/smart/smart-monitor-m7-32-inch-smart-tv-apps-4k-uhd-ls32fm700uwxxl/',
  },
  {
    description: 'For Mac, Pale Gray, tactile quiet switches',
    image: hardwareImage('mx-mechanical-mini.png'),
    name: 'Logitech MX Mechanical Mini',
    url: 'https://www.logitech.com/products/keyboards/mx-mechanical-mini.html',
  },
  {
    description: 'Off-white wireless mouse',
    image: hardwareImage('m650-off-white.png'),
    name: 'Logitech Signature M650',
    url: 'https://www.logitech.com/en-us/shop/p/m650-signature-wireless-mouse',
  },
  {
    description: 'Off-white USB webcam',
    image: hardwareImage('brio-300.png'),
    name: 'Logitech Brio 300',
    url: 'https://www.logitech.com/products/webcams/brio-300-webcam.html',
  },
  {
    description: 'Black wireless on-ear headphones',
    image: hardwareImage('major-v.png'),
    name: 'Marshall Major V',
    url: 'https://www.marshall.com/us/en/product/major-v',
  },
  {
    description: 'Desert Titanium, 256GB',
    image: hardwareImage('iphone-16-pro.png'),
    name: 'iPhone 16 Pro',
    url: 'https://support.apple.com/en-us/111840',
  },
  {
    description:
      'Silver, 128GB, Wi-Fi + Cellular, Apple Pencil, Magic Keyboard Folio',
    image: hardwareImage('ipad.png'),
    name: 'iPad 10th Gen',
    url: 'https://support.apple.com/en-us/111833',
  },
  {
    description: '45mm, Starlight, Sport Loop',
    image: hardwareImage('apple-watch.png'),
    name: 'Apple Watch Series 9',
    url: 'https://support.apple.com/en-us/121031',
  },
  {
    description: 'IKEA MITTLED, TRADFRI driver with RODRET button',
    image: hardwareImage('mittled.png'),
    name: 'IKEA Lighting',
    url: 'https://www.ikea.com/us/en/p/mittled-led-kitchen-cntrtp-lighting-strip-dimmable-white-10455434/',
  },
]

export const software: SoftwareItem[] = [
  {
    description: 'Password manager',
    featured: true,
    logo: themedSoftwareLogo('1password-light.svg', '1password-dark.svg'),
    name: '1Password',
    url: 'https://1password.com',
  },
  {
    description: 'Notch dock utility',
    logo: softwareLogo('alcove.png'),
    name: 'Alcove',
    url: 'https://tryalcove.com',
  },
  {
    description: 'Keeps Mac awake',
    logo: softwareLogo('amphetamine.png'),
    name: 'Amphetamine',
    url: 'https://apps.apple.com/app/amphetamine/id937984704',
  },
  {
    description: 'Quick notes',
    logo: softwareLogo('antinote.png'),
    name: 'Antinote',
    url: 'https://antinote.io',
  },
  {
    description: 'Menu bar organizer',
    logo: softwareLogo('bartender.png'),
    name: 'Bartender',
    url: 'https://www.macbartender.com',
  },
  {
    description: 'Unified messaging',
    logo: softwareLogo('beeper.webp'),
    name: 'Beeper',
    url: 'https://www.beeper.com',
  },
  {
    description: 'Display management',
    logo: softwareLogo('betterdisplay.png'),
    name: 'BetterDisplay',
    url: 'https://betterdisplay.pro',
  },
  {
    description: 'Screen capture and recording',
    logo: softwareLogo('cleanshotx.png'),
    name: 'CleanShot X',
    url: 'https://cleanshot.com',
  },
  {
    description: 'AI coding assistant',
    logo: softwareLogo('claude.svg'),
    name: 'Claude Code',
    url: 'https://www.anthropic.com/claude-code',
  },
  {
    description: 'Runs coding agents side by side',
    logo: softwareLogo('conductor.png'),
    name: 'Conductor',
    url: 'https://conductor.build',
  },
  {
    description: 'Notes and documents',
    logo: softwareLogo('craft.png'),
    name: 'Craft',
    url: 'https://www.craft.do',
  },
  {
    description: 'Browser',
    logo: softwareLogo('dia.png'),
    name: 'Dia',
    url: 'https://diabrowser.com',
  },
  {
    description: 'Video downloader',
    logo: softwareLogo('downie.png'),
    name: 'Downie',
    url: 'https://software.charliemonroe.net/downie/',
  },
  {
    description: 'Drag and drop shelf',
    logo: softwareLogo('dropover.png'),
    name: 'Dropover',
    url: 'https://dropoverapp.com',
  },
  {
    description: 'Terminal emulator',
    logo: softwareLogo('ghostty.svg'),
    name: 'Ghostty',
    url: 'https://ghostty.org',
  },
  {
    description: 'Digital notebook',
    logo: softwareLogo('goodnotes.png'),
    name: 'Goodnotes',
    url: 'https://www.goodnotes.com',
  },
  {
    description: 'Media player',
    logo: softwareLogo('iina.png'),
    name: 'IINA',
    url: 'https://iina.io',
  },
  {
    description: 'Mechanical keyboard sounds',
    logo: softwareLogo('klack.png'),
    name: 'Klack',
    url: 'https://tryklack.com',
  },
  {
    description: 'Break reminders',
    logo: softwareLogo('lookaway.png'),
    name: 'LookAway',
    url: 'https://lookaway.app',
  },
  {
    description: 'Window manager',
    logo: softwareLogo('loop.png'),
    name: 'Loop',
    url: 'https://github.com/MrKai77/Loop',
  },
  {
    description: 'Cleans up and optimizes my Mac',
    logo: softwareLogo('mole.png'),
    name: 'Mole',
    url: 'https://github.com/tw93/Mole',
  },
  {
    description: 'Notes and docs',
    featured: true,
    logo: softwareLogo('notion.svg'),
    name: 'Notion',
    url: 'https://www.notion.com',
  },
  {
    description: 'Calendar client',
    logo: softwareLogo('notion-calendar.webp'),
    name: 'Notion Calendar',
    url: 'https://www.notion.com/product/calendar',
  },
  {
    description: 'Coding assistant',
    logo: themedSoftwareLogo('opencode-light.svg', 'opencode-dark.svg'),
    name: 'OpenCode',
    url: 'https://opencode.ai',
  },
  {
    description: 'Containers and Linux VMs',
    logo: softwareLogo('orbstack.png'),
    name: 'OrbStack',
    url: 'https://orbstack.dev',
  },
  {
    description: 'Clipboard manager',
    logo: softwareLogo('paste.png'),
    name: 'Paste',
    url: 'https://pasteapp.io',
  },
  {
    description: 'Screen measuring tool',
    logo: softwareLogo('pixelsnap.png'),
    name: 'PixelSnap',
    url: 'https://pixelsnap.com',
  },
  {
    description: 'Bookmark manager',
    logo: softwareLogo('raindrop.svg'),
    name: 'Raindrop.io',
    url: 'https://raindrop.io',
  },
  {
    description: 'Productivity launcher',
    featured: true,
    logo: softwareLogo('raycast.svg'),
    name: 'Raycast',
    url: 'https://raycast.com',
  },
  {
    description: 'Email client',
    logo: softwareLogo('spark-mail.png'),
    name: 'Spark Mail',
    url: 'https://sparkmailapp.com',
  },
  {
    description: 'Music streaming',
    logo: softwareLogo('spotify.svg'),
    name: 'Spotify',
    url: 'https://spotify.com',
  },
  {
    description: 'Mac productivity utilities',
    logo: softwareLogo('supercharge.png'),
    name: 'Supercharge',
    url: 'https://sindresorhus.com/supercharge',
  },
  {
    description: 'SSH client',
    logo: softwareLogo('termius.webp'),
    name: 'Termius',
    url: 'https://termius.com',
  },
  {
    description: 'Writing and scheduling tool',
    logo: softwareLogo('typefully.png'),
    name: 'Typefully',
    url: 'https://typefully.com',
  },
  {
    description: 'Virtual machines',
    logo: softwareLogo('utm.png'),
    name: 'UTM',
    url: 'https://mac.getutm.app',
  },
  {
    description: 'Discord client',
    logo: softwareLogo('vesktop.svg'),
    name: 'Vesktop',
    url: 'https://vesktop.dev',
  },
  {
    description: 'Code editor',
    featured: true,
    logo: softwareLogo('vscode.svg'),
    name: 'Visual Studio Code',
    url: 'https://code.visualstudio.com',
  },
  {
    description: 'Terminal',
    logo: softwareLogo('warp.png'),
    name: 'Warp',
    url: 'https://warp.dev',
  },
  {
    description: 'Voice dictation',
    logo: softwareLogo('wispr-flow.webp'),
    name: 'Wispr Flow',
    url: 'https://wisprflow.ai',
  },
  {
    description: 'API client',
    logo: softwareLogo('yaak.png'),
    name: 'Yaak',
    url: 'https://yaak.app',
  },
]

/** Plain text with `[label](href)` links, shared by the page and the llms routes */
export const codingSetup =
  'I use [Visual Studio Code](https://code.visualstudio.com) as my main editor with the [Cursor theme](https://marketplace.visualstudio.com/items?itemName=MohdZaid.vscode-cursor-theme), [Custom UI Style](https://marketplace.visualstudio.com/items?itemName=subframe7536.custom-ui-style) tweaks, and the [JetBrains Mono](https://www.jetbrains.com/lp/mono/) font with ligatures enabled. The config is in [my dotfiles](https://github.com/techwithanirudh/dotfiles/blob/main/editors/vscode/settings.json).'
