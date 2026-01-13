import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions, linkItems } from '@/app/layout.shared'
import { Header } from '@/components/sections/header'
import { SignInCard } from './_components/sign-in-card'

interface LoginPageProps {
  searchParams?: {
    redirectTo?: string | string[]
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectToParam = Array.isArray(searchParams?.redirectTo)
    ? searchParams?.redirectTo[0]
    : searchParams?.redirectTo
  const redirectTo = redirectToParam?.startsWith('/') ? redirectToParam : '/'

  return (
    <HomeLayout
      {...baseOptions}
      className='pt-0'
      links={linkItems}
      nav={{
        component: <Header links={linkItems} {...baseOptions} />,
      }}
    >
      <main className='flex flex-1'>
        <div className='container relative mx-auto flex min-h-full flex-1 items-center justify-center border-border border-x border-b border-dashed'>
          <SignInCard redirectTo={redirectTo} />
        </div>
      </main>
    </HomeLayout>
  )
}
