import {
  Panel,
  PanelButton,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from '@/components/layout/panel'
import { ViewAnimation } from '@/components/view-animation'

const Contact = () => (
  <Panel>
    <PanelHeader>
      <PanelTitle>Get in touch</PanelTitle>
    </PanelHeader>
    <ViewAnimation
      initial={{ opacity: 0, translateY: -6 }}
      whileInView={{ opacity: 1, translateY: 0 }}
    >
      <PanelContent className='flex flex-col gap-4'>
        <p className='max-w-md text-pretty text-muted-foreground text-sm leading-relaxed'>
          Got a question, an idea, or a weird project? My inbox is open, and the
          dog is always listening.
        </p>
        <a
          className='font-mono text-muted-foreground text-xs transition-colors hover:text-foreground'
          href='mailto:hello@techwithanirudh.com'
        >
          hello@techwithanirudh.com
        </a>
      </PanelContent>
    </ViewAnimation>
    <PanelButton href='/contact'>Contact me</PanelButton>
  </Panel>
)

export default Contact
