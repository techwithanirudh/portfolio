import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from '@/components/layout/panel'
import { AskDog } from './ask-dog'

export default function About() {
  return (
    <Panel id='about'>
      <PanelHeader>
        <PanelTitle>about</PanelTitle>
      </PanelHeader>
      <PanelContent className='space-y-3 text-pretty text-muted-foreground leading-relaxed'>
        <p>
          I design websites and write the code behind them. Self-taught, I
          started with Lego, moved to robots, and now ship AI products with
          Next.js, React, and TypeScript.
        </p>
        <p>
          The dog in the corner is Simba. He has read everything on this site,
          so you can <AskDog /> anything about me.
        </p>
      </PanelContent>
    </Panel>
  )
}
