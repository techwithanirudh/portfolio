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
    <div className='flex grow flex-col items-center justify-center self-center p-4 md:p-6'>
      <SignInCard redirectTo={redirectTo} />
    </div>
  )
}
