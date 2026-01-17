'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { logout } from '@/app/actions/auth'
import { sendTransaction, refreshBalance } from '@/app/actions/wallet'

interface WalletInfo {
  address: string
  balance: string
  paraWalletId: string
}

interface Props {
  user: User
  initialWallet: WalletInfo | null
}

function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-4 w-4 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function DashboardClient({ user, initialWallet }: Props) {
  const [wallet, setWallet] = useState(initialWallet)
  const [copied, setCopied] = useState(false)
  const [copying, setCopying] = useState(false)
  const [showSend, setShowSend] = useState(false)
  const [sending, setSending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [txResult, setTxResult] = useState<{
    success?: boolean
    hash?: string
    error?: string
  } | null>(null)

  const copyAddress = async () => {
    if (!wallet || copying) return
    setCopying(true)
    await navigator.clipboard.writeText(wallet.address)
    setCopied(true)
    setCopying(false)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    const newBalance = await refreshBalance()
    if (wallet) {
      setWallet({ ...wallet, balance: newBalance })
    }
    setRefreshing(false)
  }

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    setTxResult(null)
    const formData = new FormData(e.currentTarget)
    const result = await sendTransaction(formData)
    setTxResult(result)
    setSending(false)
    if (result.success) {
      handleRefresh()
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="bg-white px-6 py-4">
        <nav className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">ParaVault</span>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-sm text-slate-500">{user.email}</span>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {loggingOut ? (
                <>
                  <Spinner className="h-3 w-3" />
                  <span>Logging out...</span>
                </>
              ) : (
                'Logout'
              )}
            </button>
          </div>
        </nav>
      </header>

      <section className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {wallet ? (
            <>
              <div className="bg-white rounded-3xl p-8 card-shadow overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-purple-50/30 pointer-events-none" />
                <div className="relative">
                  <p className="text-sm text-slate-400 mb-3">
                    Total Balance
                  </p>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-5xl font-bold tracking-tight text-slate-800">
                      {parseFloat(wallet.balance).toFixed(4)}
                    </span>
                    <span className="text-xl text-slate-400 font-medium">ETH</span>
                  </div>
                  <p className="text-sm text-slate-400">Base Sepolia Testnet</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 card-shadow">
                <p className="text-sm text-slate-400 mb-3">
                  Wallet Address
                </p>
                <div className="flex items-center justify-between gap-4">
                  <code className="text-lg font-semibold text-slate-800">{truncateAddress(wallet.address)}</code>
                  <button
                    onClick={copyAddress}
                    disabled={copying}
                    className={`text-sm font-medium transition-all flex-shrink-0 px-5 py-2 border rounded-full flex items-center gap-2 disabled:cursor-not-allowed ${
                      copied
                        ? 'text-green-600 border-green-300 bg-green-50'
                        : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {copying ? (
                      <Spinner className="h-4 w-4" />
                    ) : copied ? (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      'Copy'
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 card-shadow">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowSend(!showSend)}
                    disabled={sending}
                    className={`px-8 py-3 text-sm font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      showSend
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'btn-primary'
                    }`}
                  >
                    {showSend ? 'Cancel' : 'Send ETH'}
                  </button>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="px-8 py-3 border-2 border-slate-200 text-sm font-semibold rounded-full hover:border-indigo-500 hover:text-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-white"
                  >
                    {refreshing ? (
                      <>
                        <Spinner />
                        <span>Refreshing...</span>
                      </>
                    ) : (
                      'Refresh Balance'
                    )}
                  </button>
                  <a
                    href={`https://sepolia.basescan.org/address/${wallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 border-2 border-slate-200 text-sm font-semibold rounded-full hover:border-indigo-500 hover:text-indigo-600 transition-all inline-flex items-center gap-2 bg-white"
                  >
                    View on Basescan
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {showSend && (
                <div className="bg-white rounded-3xl p-8 card-shadow">
                  <h2 className="text-lg font-bold text-slate-800 mb-6">Send ETH</h2>

                  <form onSubmit={handleSend} className="space-y-5">
                    <div>
                      <label className="block text-sm text-slate-500 mb-2">
                        Recipient Address
                      </label>
                      <input
                        name="to"
                        type="text"
                        required
                        disabled={sending}
                        placeholder="0x..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-500 mb-2">
                        Amount (ETH)
                      </label>
                      <input
                        name="amount"
                        type="number"
                        step="0.0001"
                        min="0"
                        required
                        disabled={sending}
                        placeholder="0.01"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    {txResult?.error && (
                      <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {txResult.error}
                      </div>
                    )}

                    {txResult?.success && txResult.hash && (
                      <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                        <p className="font-medium mb-1">Transaction sent</p>
                        <a
                          href={`https://sepolia.basescan.org/tx/${txResult.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline break-all"
                        >
                          {txResult.hash}
                        </a>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3 btn-primary text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {sending ? (
                        <>
                          <Spinner />
                          <span>Signing and Sending...</span>
                        </>
                      ) : (
                        'Send Transaction'
                      )}
                    </button>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-3xl p-8 card-shadow">
                <h3 className="text-lg font-bold text-slate-800 mb-6">How this wallet works</h3>
                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>Wallet created via{' '}
                        <a
                          href="https://docs.getpara.com/v2/rest/overview"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Para REST API
                        </a>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>Keys managed using{' '}
                        <a
                          href="https://docs.getpara.com/v2/concepts/security#multi-party-computation-mpc"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          MPC
                        </a>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>Server-side tx signing</span>
                    </li>
                  </ul>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>Base Sepolia testnet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>Get testnet ETH from{' '}
                        <a
                          href="https://www.alchemy.com/faucets/base-sepolia"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Faucet
                        </a>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl p-12 card-shadow text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Creating your wallet</h2>
              <p className="text-sm text-slate-500">
                Please wait while we set up your wallet...
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
