import type { Metadata } from 'next'
import { createMetadata } from '@/lib/metadata'
import { SignInCard } from './_components/sign-in-card'

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: 'Sign In',
    description: 'Sign in to manage your account and sessions.',
    openGraph: {
      url: '/login',
    },
    alternates: {
      canonical: '/login',
    },
  })
}

interface LoginPageProps {
  searchParams?: Promise<{
    redirectTo?: string | string[]
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams

  const redirectTo = (() => {
    const value = Array.isArray(params?.redirectTo)
      ? params.redirectTo[0]
      : params?.redirectTo

    if (typeof value !== 'string') {
      return '/'
    }

    const candidate = value.trim()

    return candidate.startsWith('/') && !candidate.startsWith('//')
      ? candidate
      : '/'
  })()

  return (
    <div className='flex grow flex-col items-center justify-center self-center p-4 md:p-6'>
      <SignInCard redirectTo={redirectTo} />
    </div>
  )
}
