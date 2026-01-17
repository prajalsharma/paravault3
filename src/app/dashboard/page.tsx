import { getUserWallet } from '@/app/actions/wallet'
import { getUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  const wallet = await getUserWallet()

  return <DashboardClient user={user} initialWallet={wallet} />
}

