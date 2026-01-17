import Link from 'next/link';
import { getUser } from '@/app/actions/auth';
import PhoneMockup from '@/components/PhoneMockup';

export default async function Home() {
  const user = await getUser();

  return (
    <main className="min-h-screen flex flex-col">
      <div className="min-h-screen hero-gradient">
        <header className="px-6 lg:px-12 py-5">
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
<Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-900">ParaVault</span>
              </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors !w-[37%] !h-full">
                Home
              </Link>
              <Link href="#features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors !w-[83px] !h-full">
                Features
              </Link>
              <a
                href="https://docs.getpara.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors !w-[50px] !h-full">

                Docs
              </a>
            </div>

            <div className="flex items-center gap-3">
              {user ?
              <>
                  <span className="hidden sm:inline text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{user.email}</span>
                  <Link
                  href="/dashboard"
                  className="btn-primary px-6 py-2.5 text-sm">

                    Dashboard
                  </Link>
                </> :

              <>
                  <Link
                  href="/login"
                  className="btn-secondary px-6 py-2.5 text-sm">

                    Sign In
                  </Link>
                  <Link
                  href="/signup"
                  className="hidden sm:inline-block btn-primary px-6 py-2.5 text-sm">

                    Create Wallet
                  </Link>
                </>
              }
            </div>
          </nav>
        </header>

        <section className="px-6 lg:px-12 pt-8 pb-20 lg:pt-16 lg:pb-28">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="animate-fade-in">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-slate-900">
                  Crypto Wallets, Simplified.
                  <br />
                  <span className="text-indigo-600">Powered by <a href="https://www.getpara.com/" target="_blank" rel="noopener noreferrer" className="hover:underline decoration-indigo-400/50 underline-offset-2">Para</a>.</span>
                  <br />
                  <span className="text-slate-800">Secured with <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="hover:underline decoration-slate-400/50 underline-offset-2">Supabase</a>.</span>
                </h1>

                <p className="mt-8 text-xl text-slate-600 max-w-xl leading-relaxed !whitespace-pre-line">Sign up and get a secure crypto wallet instantly. No seed phrases, no complexity. Just simple, secure transactions on Sepolia testnet

                </p>

                <div className="mt-12 flex flex-wrap gap-4">
                  {user ?
                  <Link
                    href="/dashboard"
                    className="btn-primary px-10 py-4 text-base">

                      Go to Dashboard
                    </Link> :

                  <>
                      <Link
                      href="/signup"
                      className="btn-primary px-10 py-4 text-base">

                        Get Started
                      </Link>
                      <a
                      href="https://docs.getpara.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary px-10 py-4 text-base">

                        View Docs
                      </a>
                    </>
                  }
                </div>
              </div>

              <div className="flex justify-center lg:justify-end animate-fade-in delay-200">
                <PhoneMockup />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="features" className="px-6 lg:px-12 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-10 border border-slate-100 card-shadow transition-transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-md mb-8">
                <svg className="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-400 tracking-widest">01</span>
              <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Instant Setup</h3>
              <p className="text-slate-600 leading-relaxed">
                Get a wallet in seconds. No browser extensions, no app downloads.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 border border-slate-100 card-shadow transition-transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-md mb-8">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-400 tracking-widest">02</span>
              <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Secure by Default</h3>
              <p className="text-slate-600 leading-relaxed">
                Para handles key management with{' '}
                <a
                  href="https://docs.getpara.com/v2/concepts/security#multi-party-computation-mpc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium">
                  MPC
                </a>
                . Your keys never leave secure infrastructure.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 border border-slate-100 card-shadow transition-transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-md mb-8">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-400 tracking-widest">03</span>
              <h3 className="text-xl font-bold text-slate-900 mb-4 mt-2">Send and Receive</h3>
              <p className="text-slate-600 leading-relaxed">
                Transfer ETH on{' '}
                <a
                  href="https://www.alchemy.com/faucets/base-sepolia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium">
                  Base Sepolia Testnet
                </a>
                . Sign transactions with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 lg:px-12 py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm font-medium text-slate-500">
            Powered by{' '}
            <a
              href="https://docs.getpara.com/v2/rest/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 transition-colors">
              Para REST API
            </a>
            {' '}• Secured with{' '}
            <a
              href="https://supabase.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 transition-colors">
              Supabase
            </a>
          </p>

          <div className="flex items-center gap-8">
            <a
              href="https://docs.getpara.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              Documentation
            </a>
          </div>
        </div>
      </footer>
    </main>);

}