
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
}: PageProps<'/auth/[pathname]'>) {
  const { pathname } = await params

  return (
    <div className="p-4 md:p-6 flex-1">
      <AccountView
        classNames={{
          sidebar: {
            base: 'sticky top-20',
            button: 'border',
            buttonActive: 'bg-accent/50',
          }
        }}
        pathname={pathname}
      />
    </div>
  )
}