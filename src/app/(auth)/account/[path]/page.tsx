
import { AccountView } from "@daveyplate/better-auth-ui"
import { accountViewPaths } from "@daveyplate/better-auth-ui/server"

export const dynamicParams = false

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({
    path,
  }))
}

export default async function AccountPage({
  params,
}: PageProps<'/auth/[path]'>) {
  const { path } = await params

  return (
    <div className="self-center p-4 md:p-6">
      <AccountView
        classNames={{
          sidebar: {
            base: 'sticky top-20',
          },
        }}
        path={path}
      />
    </div>
  )
}