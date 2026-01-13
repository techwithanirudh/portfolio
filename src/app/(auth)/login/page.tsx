import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions, linkItems } from '@/app/layout.shared'
import { Header } from '@/components/sections/header'
import { SignInCard } from './_components/sign-in-card'

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const params = await searchParams

  const redirectTo = (() => {
    const value = Array.isArray(params?.redirectTo)
      ? params.redirectTo[0]
      : params?.redirectTo

    return typeof value === 'string' && value.startsWith('/') ? value : '/'
  })()

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
