import { facts } from '@/constants/portfolio/colophon'

export const Facts = () => (
  <dl className='grid grid-cols-2 sm:grid-cols-4 sm:[&>*:not(:last-child)]:border-r max-sm:[&>*:nth-child(-n+2)]:border-b max-sm:[&>*:nth-child(odd)]:border-r [&>*]:border-line'>
    {facts.map((fact) => (
      <div className='flex flex-col gap-1 px-4 py-3' key={fact.label}>
        <dt className='font-mono text-muted-foreground text-xs'>
          {fact.label}
        </dt>
        <dd className='font-heading font-medium text-foreground text-sm tracking-tight'>
          {fact.value}
        </dd>
      </div>
    ))}
  </dl>
)
