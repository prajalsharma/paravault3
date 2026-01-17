'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'

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

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-[var(--border)] px-6 py-4">
        <nav className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-sm font-medium tracking-tight">
            para wallet
          </Link>
          <Link
            href="/signup"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            sign up
          </Link>
        </nav>
      </header>

      <section className="flex-1 flex items-center px-6">
        <div className="max-w-4xl mx-auto w-full py-20">
          <div className="max-w-sm">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl font-medium tracking-tight mb-2">Welcome back</h1>
            <p className="text-sm text-[var(--muted)]">
              Sign in to access your wallet
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in delay-100">
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-[var(--muted)] mb-2 uppercase tracking-wide"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs text-[var(--muted)] mb-2 uppercase tracking-wide"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--accent)] text-[var(--accent-text)] text-sm font-medium rounded-md hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-8 text-sm text-[var(--muted)] animate-fade-in delay-200">
            Do not have an account?{' '}
            <Link
              href="/signup"
              className="text-[var(--foreground)] hover:underline"
            >
              Sign up
            </Link>
          </p>
          </div>
        </div>
      </section>
    </main>
  )
}

