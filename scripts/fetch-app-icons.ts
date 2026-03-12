#!/usr/bin/env bun
/**
 * Script to fetch app icons for the uses page.
 * Sources:
 * 1. iTunes Search API (Mac App Store icons)
 * 2. SimpleIcons CDN (brand SVGs)
 * 3. Direct URLs from official sites / GitHub
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const OUTPUT_DIR = join(import.meta.dir, '../public/images/uses/software')

async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
}

async function download(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
    })
    if (!res.ok) return false
    const buf = await res.arrayBuffer()
    await writeFile(dest, Buffer.from(buf))
    console.log(`  ✓  ${dest.split('/').pop()}`)
    return true
  } catch {
    return false
  }
}

async function fetchFromSimpleIcons(slug: string, filename: string): Promise<boolean> {
  const url = `https://cdn.simpleicons.org/${slug}.svg`
  const dest = join(OUTPUT_DIR, filename)
  return download(url, dest)
}

async function fetchFromItunes(appName: string, filename: string): Promise<boolean> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(appName)}&entity=macSoftware&limit=5&country=us`
  try {
    const res = await fetch(url)
    if (!res.ok) return false
    const data = await res.json() as { results: Array<{ artworkUrl512?: string; trackName?: string }> }
    if (!data.results?.length) return false

    // Find the best match
    const match = data.results.find(r =>
      r.trackName?.toLowerCase().includes(appName.toLowerCase()) ||
      appName.toLowerCase().includes(r.trackName?.toLowerCase() ?? '')
    ) ?? data.results[0]

    if (!match?.artworkUrl512) return false
    const dest = join(OUTPUT_DIR, filename)
    return download(match.artworkUrl512, dest)
  } catch {
    return false
  }
}

async function fetchDirect(url: string, filename: string): Promise<boolean> {
  const dest = join(OUTPUT_DIR, filename)
  return download(url, dest)
}

async function main() {
  await ensureDir(OUTPUT_DIR)

  console.log('Fetching app icons...\n')

  // Apps to fetch with their strategies
  const tasks: Array<{ name: string; file: string; strategies: Array<() => Promise<boolean>> }> = [
    {
      name: 'Alcove',
      file: 'alcove.png',
      strategies: [
        () => fetchFromItunes('Alcove', 'alcove.png'),
        () => fetchDirect('https://tryalcove.com/images/icon.png', 'alcove.png'),
      ],
    },
    {
      name: 'Amphetamine',
      file: 'amphetamine.png',
      strategies: [
        () => fetchFromItunes('Amphetamine', 'amphetamine.png'),
      ],
    },
    {
      name: 'Antinote',
      file: 'antinote.png',
      strategies: [
        () => fetchFromItunes('Antinote', 'antinote.png'),
        () => fetchDirect('https://antinote.io/assets/icon.png', 'antinote.png'),
      ],
    },
    {
      name: 'Bartender',
      file: 'bartender.png',
      strategies: [
        () => fetchFromItunes('Bartender 4', 'bartender.png'),
        () => fetchFromItunes('Bartender', 'bartender.png'),
      ],
    },
    {
      name: 'Beeper',
      file: 'beeper.png',
      strategies: [
        () => fetchFromSimpleIcons('beeper', 'beeper.svg').then(ok => ok ? Promise.resolve(true) : Promise.reject()),
        () => fetchDirect('https://www.beeper.com/favicon.ico', 'beeper.png'),
      ],
    },
    {
      name: 'BetterDisplay',
      file: 'betterdisplay.png',
      strategies: [
        () => fetchFromItunes('BetterDisplay', 'betterdisplay.png'),
        () => fetchDirect('https://betterdisplay.pro/media/logo.svg', 'betterdisplay.svg'),
      ],
    },
    {
      name: 'CleanShot X',
      file: 'cleanshotx.png',
      strategies: [
        () => fetchFromItunes('CleanShot X', 'cleanshotx.png'),
        () => fetchDirect('https://cleanshot.com/img/logo.svg', 'cleanshotx.svg'),
      ],
    },
    {
      name: 'Claude Code',
      file: 'claude.svg',
      strategies: [
        () => fetchFromSimpleIcons('anthropic', 'claude.svg'),
        () => fetchDirect('https://cdn.simpleicons.org/anthropic', 'claude.svg'),
      ],
    },
    {
      name: 'Conductor',
      file: 'conductor.png',
      strategies: [
        () => fetchFromItunes('Conductor', 'conductor.png'),
        () => fetchDirect('https://conductor.build/icon.png', 'conductor.png'),
      ],
    },
    {
      name: 'Craft',
      file: 'craft.png',
      strategies: [
        () => fetchFromSimpleIcons('craft', 'craft.svg').then(ok => ok ? Promise.resolve(true) : Promise.reject()),
        () => fetchFromItunes('Craft - Docs and Notes Editor', 'craft.png'),
        () => fetchFromItunes('Craft', 'craft.png'),
      ],
    },
    {
      name: 'Dia',
      file: 'dia.png',
      strategies: [
        () => fetchFromItunes('Dia Browser', 'dia.png'),
        () => fetchDirect('https://diabrowser.com/icon.png', 'dia.png'),
      ],
    },
    {
      name: 'Downie',
      file: 'downie.png',
      strategies: [
        () => fetchFromItunes('Downie', 'downie.png'),
      ],
    },
    {
      name: 'Dropover',
      file: 'dropover.png',
      strategies: [
        () => fetchFromItunes('Dropover', 'dropover.png'),
      ],
    },
    {
      name: 'Goodnotes',
      file: 'goodnotes.png',
      strategies: [
        () => fetchFromSimpleIcons('goodnotes', 'goodnotes.svg'),
        () => fetchFromItunes('GoodNotes 5', 'goodnotes.png'),
        () => fetchFromItunes('Goodnotes', 'goodnotes.png'),
      ],
    },
    {
      name: 'IINA',
      file: 'iina.png',
      strategies: [
        () => fetchDirect('https://raw.githubusercontent.com/iina/iina/master/iina/Assets.xcassets/AppIcon.appiconset/AppIcon_1024x1024.png', 'iina.png'),
        () => fetchFromItunes('IINA', 'iina.png'),
      ],
    },
    {
      name: 'LookAway',
      file: 'lookaway.png',
      strategies: [
        () => fetchFromItunes('LookAway', 'lookaway.png'),
        () => fetchFromItunes('Look Away', 'lookaway.png'),
      ],
    },
    {
      name: 'Loop',
      file: 'loop.png',
      strategies: [
        () => fetchDirect('https://raw.githubusercontent.com/MrKai77/Loop/main/Loop/Resources/Assets.xcassets/AppIcon.appiconset/1024.png', 'loop.png'),
        () => fetchFromItunes('Loop Window Manager', 'loop.png'),
      ],
    },
    {
      name: 'Mole',
      file: 'mole.png',
      strategies: [
        () => fetchDirect('https://raw.githubusercontent.com/tw93/Mole/main/assets/icon.png', 'mole.png'),
        () => fetchFromItunes('Mole', 'mole.png'),
      ],
    },
    {
      name: 'Notion Calendar',
      file: 'notion-calendar.png',
      strategies: [
        () => fetchFromItunes('Notion Calendar', 'notion-calendar.png'),
        () => fetchFromItunes('Cron', 'notion-calendar.png'),
      ],
    },
    {
      name: 'OpenCode',
      file: 'opencode.svg',
      strategies: [
        () => fetchDirect('https://opencode.ai/icon.svg', 'opencode.svg'),
        () => fetchDirect('https://opencode.ai/favicon.svg', 'opencode.svg'),
        () => fetchDirect('https://raw.githubusercontent.com/sst/opencode/main/packages/web/public/logo.svg', 'opencode.svg'),
      ],
    },
    {
      name: 'OrbStack',
      file: 'orbstack.png',
      strategies: [
        () => fetchFromSimpleIcons('orbstack', 'orbstack.svg'),
        () => fetchFromItunes('OrbStack', 'orbstack.png'),
        () => fetchDirect('https://orbstack.dev/favicon.png', 'orbstack.png'),
      ],
    },
    {
      name: 'Paste',
      file: 'paste.png',
      strategies: [
        () => fetchFromItunes('Paste - Endless Clipboard', 'paste.png'),
        () => fetchFromItunes('Paste', 'paste.png'),
      ],
    },
    {
      name: 'Pictogram',
      file: 'pictogram.png',
      strategies: [
        () => fetchFromItunes('Pictogram', 'pictogram.png'),
      ],
    },
    {
      name: 'PixelSnap',
      file: 'pixelsnap.png',
      strategies: [
        () => fetchFromItunes('PixelSnap 2', 'pixelsnap.png'),
        () => fetchFromItunes('PixelSnap', 'pixelsnap.png'),
      ],
    },
    {
      name: 'Spark Mail',
      file: 'spark-mail.png',
      strategies: [
        () => fetchFromSimpleIcons('sparkmail', 'spark-mail.svg'),
        () => fetchFromItunes('Spark – Email App by Readdle', 'spark-mail.png'),
        () => fetchFromItunes('Spark Mail', 'spark-mail.png'),
      ],
    },
    {
      name: 'Supercharge',
      file: 'supercharge.png',
      strategies: [
        () => fetchFromItunes('Supercharge', 'supercharge.png'),
        () => fetchDirect('https://sindresorhus.com/supercharge/icon.png', 'supercharge.png'),
      ],
    },
    {
      name: 'Termius',
      file: 'termius.svg',
      strategies: [
        () => fetchFromSimpleIcons('termius', 'termius.svg'),
        () => fetchFromItunes('Termius', 'termius.png'),
      ],
    },
    {
      name: 'Typefully',
      file: 'typefully.svg',
      strategies: [
        () => fetchFromSimpleIcons('typefully', 'typefully.svg'),
        () => fetchFromItunes('Typefully', 'typefully.png'),
      ],
    },
    {
      name: 'UTM',
      file: 'utm.png',
      strategies: [
        () => fetchDirect('https://raw.githubusercontent.com/utmapp/UTM/main/Platform/Shared/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png', 'utm.png'),
        () => fetchFromItunes('UTM', 'utm.png'),
      ],
    },
    {
      name: 'Vesktop',
      file: 'vesktop.png',
      strategies: [
        () => fetchDirect('https://raw.githubusercontent.com/Vencord/Vesktop/main/static/icon.png', 'vesktop.png'),
        () => fetchFromItunes('Vesktop', 'vesktop.png'),
      ],
    },
    {
      name: 'Wispr Flow',
      file: 'wispr-flow.png',
      strategies: [
        () => fetchFromItunes('Wispr Flow', 'wispr-flow.png'),
        () => fetchDirect('https://wisprflow.ai/icon.png', 'wispr-flow.png'),
      ],
    },
    {
      name: 'Yaak',
      file: 'yaak.png',
      strategies: [
        () => fetchFromItunes('Yaak', 'yaak.png'),
        () => fetchDirect('https://yaak.app/icon.png', 'yaak.png'),
      ],
    },
  ]

  const results: Record<string, string | null> = {}

  for (const task of tasks) {
    process.stdout.write(`${task.name}: `)
    let success = false
    let finalFile = task.file

    for (const strategy of task.strategies) {
      try {
        const ok = await strategy()
        if (ok) {
          success = true
          // Detect the actual file that was written (might differ from task.file if svg fallback)
          break
        }
      } catch {
        // try next strategy
      }
    }

    if (success) {
      // Check which file actually exists
      const base = task.file.replace(/\.\w+$/, '')
      for (const ext of ['.png', '.svg', '.jpg', '.webp']) {
        if (existsSync(join(OUTPUT_DIR, base + ext))) {
          finalFile = base + ext
          break
        }
      }
      results[task.name] = `/images/uses/software/${finalFile}`
      console.log(`  → ${finalFile}`)
    } else {
      results[task.name] = null
      console.log('  ✗ not found')
    }
  }

  console.log('\n\nResults summary:')
  console.log(JSON.stringify(results, null, 2))
}

main().catch(console.error)
