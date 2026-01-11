import Image from 'next/image'
import Link from 'next/link'
import { Prose } from '@/components/prose'
import { Section } from '@/components/section'
import { ViewAnimation } from '@/components/view-animation'
import { cn } from '@/lib/utils'

interface Role {
  _title: string
  _slug: string
  description: string
  endYear?: number
  startYear: number
  role: string
  url: string
  location: string
  type: string
  logo: {
    width: number
    height: number
    url: string
    alt?: string
  }
}

interface RolesProps {
  roles: Role[]
}

export const Roles = ({ roles }: RolesProps) => {
  if (!roles.length) {
    return <div>No roles found</div>
  }

  return (
    <Section className='grid sm:grid-cols-2'>
      {roles.map((role, index) => (
        <ViewAnimation
          className={cn(
            index % 2 === 0 ? 'border-dashed sm:border-r' : '',
            index < roles.length - 2 ? 'border-b border-dashed' : ''
          )}
          delay={index % 2 ? 0.2 : 0}
          initial={{ opacity: 0 }}
          key={role._title}
          whileInView={{ opacity: 1 }}
        >
          <Link
            className={cn(
              'flex flex-col items-start gap-6 px-4 py-8 transition-colors hover:bg-background',
              'sm:flex-row sm:px-8'
            )}
            href={`/work/${role._slug}`}
          >
            <div className='flex h-12 w-12 shrink-0 items-center justify-center'>
              <Image
                alt={role.logo.alt ?? ''}
                className='block size-full object-contain dark:brightness-0 dark:invert'
                height={role.logo.height}
                src={role.logo.url}
                width={role.logo.width}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <h2 className='font-semibold text-xl tracking-tight'>
                <span className='block leading-tight'>{role.role}</span>
                <span className='block text-muted-foreground'>
                  {role._title}
                </span>
              </h2>
              <Prose className='prose-sm'>
                <p>{role.description}</p>
              </Prose>
              <p className='text-muted-foreground text-sm'>
                {role.type} &bull; {role.startYear} &mdash;{' '}
                {role.endYear ?? 'Present'} &bull; {role.location}
              </p>
            </div>
          </Link>
        </ViewAnimation>
      ))}
      {roles.length % 2 && (
        <div className='hidden border-t bg-dashed sm:block' />
      )}
    </Section>
  )
}
