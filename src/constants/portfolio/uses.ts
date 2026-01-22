import type { UseCategory } from '@/types'

export const uses: UseCategory[] = [
  {
    category: 'Applications',
    type: 'applications',
    items: [
      // Development
      {
        name: 'VS Code',
        description: 'My primary code editor with vim keybindings.',
        logo: { type: 'svgl', id: 'vscode' },
        url: 'https://code.visualstudio.com',
        featured: true,
      },
      {
        name: 'Warp',
        description: 'A modern, fast terminal with AI built-in.',
        logo: { type: 'svgl', id: 'warp' },
        url: 'https://warp.dev',
      },
      {
        name: 'GitHub',
        description: 'Version control and collaboration platform.',
        logo: {
          type: 'svgl',
          id: { light: 'github_dark', dark: 'github_light' },
        },
        url: 'https://github.com',
        featured: true,
      },
      {
        name: 'Vercel',
        description: 'Deployment and hosting for web applications.',
        logo: { type: 'svgl', id: { light: 'vercel_dark', dark: 'vercel' } },
        url: 'https://vercel.com',
        featured: true,
      },
      // Design
      {
        name: 'Figma',
        description: 'Design tool for creating interfaces and prototypes.',
        logo: { type: 'svgl', id: 'figma' },
        url: 'https://figma.com',
        featured: true,
      },
      {
        name: 'Excalidraw',
        description: 'Virtual whiteboard for sketching diagrams.',
        url: 'https://excalidraw.com',
      },
      // Productivity
      {
        name: 'Notion',
        description: 'All-in-one workspace for notes and docs.',
        logo: { type: 'svgl', id: 'notion' },
        url: 'https://notion.so',
        featured: true,
      },
      {
        name: 'Linear',
        description: 'Issue tracking and project management.',
        logo: { type: 'svgl', id: 'linear' },
        url: 'https://linear.app',
      },
      {
        name: 'Raycast',
        description: 'Productivity launcher for macOS.',
        logo: { type: 'svgl', id: 'raycast' },
        url: 'https://raycast.com',
        featured: true,
      },
      {
        name: 'Arc',
        description: 'A better browser with spaces and profiles.',
        logo: { type: 'svgl', id: 'arc_browser' },
        url: 'https://arc.net',
      },
      // AI & Research
      {
        name: 'Claude',
        description: 'AI assistant for coding and research.',
        logo: { type: 'svgl', id: 'claude-ai-icon' },
        url: 'https://claude.ai',
        featured: true,
      },
      {
        name: 'ChatGPT',
        description: 'AI assistant for various tasks.',
        logo: { type: 'svgl', id: { light: 'openai_dark', dark: 'openai' } },
        url: 'https://chat.openai.com',
      },
      {
        name: 'Perplexity',
        description: 'AI-powered search and research tool.',
        logo: { type: 'svgl', id: 'perplexity' },
        url: 'https://perplexity.ai',
      },
      // Communication
      {
        name: 'Discord',
        description: 'Community chat and voice communication.',
        logo: { type: 'svgl', id: 'discord' },
        url: 'https://discord.com',
      },
      {
        name: 'Slack',
        description: 'Team communication and collaboration.',
        logo: { type: 'svgl', id: 'slack' },
        url: 'https://slack.com',
      },
    ],
  },
  {
    category: 'Peripherals',
    type: 'hardware',
    items: [
      {
        name: 'Keychron K3 Pro',
        description:
          'Wireless custom mechanical keyboard with low-profile switches and excellent build quality.',
        url: 'https://www.keychron.com/products/keychron-k3-pro-qmk-via-wireless-custom-mechanical-keyboard',
      },
      {
        name: 'Logitech MX Master 3S',
        description:
          'Wireless mouse with ergonomic design and customizable buttons for productivity.',
        url: 'https://www.logitech.com/products/mice/mx-master-3s.html',
      },
      {
        name: 'Sony WH-1000XM5',
        description:
          'Premium wireless headphones with industry-leading noise cancellation.',
        url: 'https://www.sony.com/electronics/headband-headphones/wh-1000xm5',
      },
    ],
  },
  {
    category: 'Desk Setup',
    type: 'hardware',
    items: [
      {
        name: 'LG 27" 4K Monitor',
        description:
          'Crisp 4K display with excellent color accuracy for design and development work.',
        url: 'https://www.lg.com/monitors',
      },
      {
        name: 'Monitor Arm',
        description:
          'Adjustable monitor mount for ergonomic positioning and desk space optimization.',
      },
      {
        name: 'Standing Desk',
        description:
          'Electric sit-stand desk for healthier work posture throughout the day.',
      },
    ],
  },
  {
    category: 'Mobile Devices',
    type: 'hardware',
    items: [
      {
        name: 'iPhone 15 Pro',
        description:
          'Daily driver phone with excellent camera and seamless ecosystem integration.',
        url: 'https://www.apple.com/iphone-15-pro',
      },
      {
        name: 'AirPods Pro',
        description:
          'Wireless earbuds with active noise cancellation and spatial audio.',
        url: 'https://www.apple.com/airpods-pro',
      },
      {
        name: 'iPad Pro',
        description:
          'Tablet for sketching, reading, and portable productivity on the go.',
        url: 'https://www.apple.com/ipad-pro',
      },
    ],
  },
]
