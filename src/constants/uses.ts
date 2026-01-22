export type UseLogo =
  | { type: 'svgl'; id: string | { light: string; dark: string } }
  | { type: 'custom'; url: string }

export interface UseItem {
  name: string
  description: string
  url: string
  logo?: UseLogo
  featured?: boolean
}

export interface UseCategory {
  category: string
  items: UseItem[]
}

export const uses: UseCategory[] = [
  {
    category: 'Development',
    items: [
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
    ],
  },
  {
    category: 'Design',
    items: [
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
    ],
  },
  {
    category: 'Productivity',
    items: [
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
    ],
  },
  {
    category: 'AI & Research',
    items: [
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
    ],
  },
  {
    category: 'Communication',
    items: [
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
]

export const usesPageMeta = {
  title: 'Uses',
  description:
    'The software, services, and gadgets that keep my daily workflow smooth and focused.',
}
