'use server'

import { createClient } from '@/lib/supabase/server'
import { createWallet, pollWalletReady } from '@/lib/para'
import { redirect } from 'next/navigation'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL is not set')
  }

  // Create Supabase user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.user) {
    return { error: 'Failed to create user' }
  }

  // Check if email confirmation is required
  if (data.user.identities?.length === 0) {
    return { error: 'This email is already registered. Please login instead.' }
  }

  // If session exists, user is auto-confirmed (email confirmation disabled)
  if (data.session) {
    // Create Para wallet using user ID as identifier
    try {
      const { wallet } = await createWallet(data.user.id, 'CUSTOM_ID', 'EVM')
      const readyWallet = await pollWalletReady(wallet.id)

      // Store wallet mapping in Supabase
      const adminClient = getAdminClient()
      const { error: walletError } = await adminClient.from('wallets').insert({
        user_id: data.user.id,
        para_wallet_id: readyWallet.id,
        address: readyWallet.address,
        type: readyWallet.type,
      })

      if (walletError) {
        console.error('Failed to store wallet mapping:', walletError)
      }
    } catch (e) {
      console.error('Failed to create Para wallet:', e)
    }

    redirect('/dashboard')
  }

  // Email confirmation required - return success for client to show message
  return { success: true, message: 'Check your email to verify your account' }
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

