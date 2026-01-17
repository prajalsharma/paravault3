import { getUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import SignupForm from './SignupForm'

export default async function SignupPage() {
  const user = await getUser()
  
  if (user) {
    redirect('/dashboard')
  }

  return <SignupForm />
}
