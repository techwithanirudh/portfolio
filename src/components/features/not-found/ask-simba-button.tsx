'use client'

import { useAssistantContext } from '@/components/features/assistant'
import { Icons } from '@/components/icons/icons'
import { Button } from '@/components/ui/button'

export const AskSimbaButton = () => {
  const { setOpen } = useAssistantContext()

  return (
    <Button onClick={() => setOpen(true)} variant='outline'>
      <Icons.pawPrint className='size-4' />
      Ask Simba
    </Button>
  )
}
