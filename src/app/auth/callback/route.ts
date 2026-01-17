import { createClient } from '@/lib/supabase/server'
import { createWallet, pollWalletReady } from '@/lib/para'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if wallet already exists for this user
      const adminClient = getAdminClient()
      const { data: existingWallet } = await adminClient
        .from('wallets')
        .select('id')
        .eq('user_id', data.user.id)
        .single()

      // Create wallet if it doesn't exist
      if (!existingWallet) {
        try {
          const { wallet } = await createWallet(data.user.id, 'CUSTOM_ID', 'EVM')
          const readyWallet = await pollWalletReady(wallet.id)

          await adminClient.from('wallets').insert({
            user_id: data.user.id,
            para_wallet_id: readyWallet.id,
            address: readyWallet.address,
            type: readyWallet.type,
          })
        } catch (e) {
          console.error('Failed to create Para wallet:', e)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${origin}/login?error=Could not verify email`)
}
