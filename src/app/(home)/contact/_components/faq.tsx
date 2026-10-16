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
import { AskSimbaLink } from './ask-simba-link'

export const FAQ = () => (
  <SplitSection>
    <SplitSectionSidebar>
      <SectionHeader
        align='left'
        description={
          <>
            Still curious? <AskSimbaLink />, he's read everything on this site.
          </>
        }
        sticky
        title='FAQ'
      />
    </SplitSectionSidebar>

    <SplitSectionContent>
      <Accordion className='w-full [&>[data-slot=accordion-item]:last-child]:border-b-0 [&>[data-slot=accordion-item]]:border-border [&>[data-slot=accordion-item]]:border-b [&>[data-slot=accordion-item]]:border-dashed'>
        {faq.map((item, index) => (
          <ViewAnimation
            className='border-border border-b border-dashed last:border-b-0'
            delay={0.05 * index}
            key={item.question}
          >
            <AccordionItem value={`index-${index}`}>
              <AccordionTrigger className='rounded-none px-4 hover:bg-card hover:no-underline data-open:bg-card'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='!h-auto p-4'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          </ViewAnimation>
        ))}
      </Accordion>
    </SplitSectionContent>
  </SplitSection>
)
