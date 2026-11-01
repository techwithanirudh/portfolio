import { SectionHeader } from '@/components/layout/sections/header'
import {
  SplitSection,
  SplitSectionContent,
  SplitSectionSidebar,
} from '@/components/layout/sections/split'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ViewAnimation } from '@/components/view-animation'
import { faq } from '@/constants/portfolio/faq'
import { staggerDelay } from '@/lib/stagger'
import { AskSimbaLink } from './ask-simba-link'

export const FAQ = () => (
  <SplitSection fill>
    <SplitSectionSidebar>
      <SectionHeader
        align='left'
        description={
          <>
            Still curious? <AskSimbaLink />, he's read everything on this site.
          </>
        }
        sticky
        title='Frequently asked questions'
      />
    </SplitSectionSidebar>

    <SplitSectionContent>
      <Accordion className='w-full'>
        {faq.map((item, index) => (
          <ViewAnimation
            className='border-border border-b border-dashed last:border-b-0'
            delay={staggerDelay(index)}
            key={item.question}
          >
            <AccordionItem value={`index-${index}`}>
              <AccordionTrigger className='items-center rounded-none px-4 hover:bg-card hover:no-underline focus-visible:border-transparent focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-primary/60 focus-visible:ring-inset data-open:bg-card'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='p-4'>{item.answer}</AccordionContent>
            </AccordionItem>
          </ViewAnimation>
        ))}
      </Accordion>
    </SplitSectionContent>
  </SplitSection>
)
