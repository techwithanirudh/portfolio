import { cn } from '@/lib/utils'

interface SeparatorProps {
  className?: string
}

const Separator = ({ className }: SeparatorProps) => (
  <div className='container mx-auto'>
    <div
      aria-hidden
      className={cn('h-8 border-line border-x bg-dashed', className)}
    />
  </div>
)

export default Separator
