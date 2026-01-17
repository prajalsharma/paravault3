'use server'

import { createClient } from '@/lib/supabase/server'
import { signRaw, createWallet, pollWalletReady } from '@/lib/para'
import {
  getBalance,
  buildTransaction,
  broadcastTransaction,
  isValidAddress,
} from '@/lib/ethereum'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { keccak256 } from 'ethers'

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface WalletInfo {
  address: string
  balance: string
  paraWalletId: string
}

export async function getUserWallet(): Promise<WalletInfo | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const adminClient = getAdminClient()
  const { data: wallet } = await adminClient
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!wallet) {
    // Try to create wallet if it doesn't exist
    try {
      const { wallet: newWallet } = await createWallet(
        user.id,
        'CUSTOM_ID',
        'EVM'
      )
      const readyWallet = await pollWalletReady(newWallet.id)

      await adminClient.from('wallets').insert({
        user_id: user.id,
        para_wallet_id: readyWallet.id,
        address: readyWallet.address,
        type: readyWallet.type,
      })

      const balance = await getBalance(readyWallet.address!)
      return {
        address: readyWallet.address!,
        balance,
        paraWalletId: readyWallet.id,
      }
    } catch (e) {
      console.error('Failed to create wallet:', e)
      return null
    }
  }

  const balance = await getBalance(wallet.address)
  return {
    address: wallet.address,
    balance,
    paraWalletId: wallet.para_wallet_id,
  }
}

export async function sendTransaction(formData: FormData) {
  const to = formData.get('to') as string
  const amount = formData.get('amount') as string

  if (!isValidAddress(to)) {
    return { error: 'Invalid recipient address' }
  }

  const amountNum = parseFloat(amount)
  if (isNaN(amountNum) || amountNum <= 0) {
    return { error: 'Invalid amount' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const adminClient = getAdminClient()
  const { data: wallet } = await adminClient
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!wallet) {
    return { error: 'Wallet not found' }
  }

  try {
    // Build the transaction
    const { tx, serialized } = await buildTransaction(wallet.address, to, amount)
    console.log('Built transaction:', { tx, serialized })

    // Hash the serialized unsigned tx for signing
    const txHash = keccak256(serialized)
    console.log('Transaction hash for signing:', txHash)

    // Sign with Para
    console.log('Signing with Para wallet:', wallet.para_wallet_id)
    const { signature } = await signRaw(wallet.para_wallet_id, txHash)
    console.log('Got signature:', signature)

    // Broadcast
    const hash = await broadcastTransaction(tx, signature)
    console.log('Broadcast successful:', hash)

    return { success: true, hash }
  } catch (e) {
    console.error('Transaction failed:', e)
    return { error: e instanceof Error ? e.message : 'Transaction failed' }
  }
}

export async function refreshBalance() {
  const wallet = await getUserWallet()
  return wallet?.balance ?? '0'
}

