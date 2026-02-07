import { AccountSettings } from './_components/account-settings'

export default function AccountPage() {
  return (
    <div className='flex w-full grow flex-col p-4 md:p-6'>
      <div className='w-full space-y-6'>
        <div>
          <h1 className='font-medium text-xl'>Account Settings</h1>
          <p className='text-muted-foreground text-sm'>
            Manage your account information.
          </p>
        </div>
        <AccountSettings />
      </div>
    </div>
  )
}
