'use client'

import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'

// Browsers' "Save as PDF" turns the print stylesheet into the resume PDF
export function PrintButton() {
  return (
    <Button onClick={() => window.print()} shape='square' size='sm'>
      <Icons.download className='transition-transform will-change-transform group-hover/button:-rotate-12 group-hover/button:scale-125' />
      Download PDF
    </Button>
  )
}
