'use client'

import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'

export function PrintButton() {
  return (
    <Button
      nativeButton={false}
      render={(props) => (
        <a download='anirudh-sriram-resume.pdf' href='/resume.pdf' {...props}>
          {props.children}
        </a>
      )}
      size='sm'
    >
      <Icons.download className='transition-transform group-hover/button:-rotate-12 group-hover/button:scale-125' />
      Download PDF
    </Button>
  )
}
