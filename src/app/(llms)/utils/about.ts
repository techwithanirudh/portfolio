import { baseUrl } from '@/constants'
import { socials } from '@/constants/navigation'
import { description, owner, title } from '@/constants/site'
import { url } from '@/lib/url'

export function getAboutText() {
  return `# About 
Route: ${url('/about')}

${description}

## Overview

I'm Anirudh (techwithanirudh), a design engineer and full-stack developer who builds beautiful, functional websites.

## Background

Hi, I'm Anirudh. I'm a self-taught software engineer and a student who loves building things with code. I grew up playing with computers, and now I'm passionate about learning new technologies and always improving my skills.

If you're curious, my journey began with Lego sets as a kid, building, breaking, and rebuilding anything I could imagine. That hands-on curiosity slowly turned into a love for making things with code. Over time, I moved from robots and gadgets to websites and apps, always chasing the next challenge. Since then, I've spent countless hours coding, brainstorming, and wrestling with bugs that taught me a lot more than any tutorial ever could.

## Personal Information

- Name: ${owner}
- Display Name: ${title}
- Website: ${baseUrl.toString()}
- Resume: ${url('/resume.pdf')}

## Social Links

${socials.map((item) => `- [${item.name}](${item.url})${item.description ? ` - ${item.description}` : ''}`).join('\n')}
`
}
