'use client'

export default function PhoneMockup() {
  return (
    <div className="relative w-full max-w-[520px] h-[480px] flex items-center justify-center">
      <div className="absolute w-[320px] h-[320px] bg-[#b8c5dc] rounded-full" />
      
      <div className="absolute top-0 left-0 grid grid-cols-6 gap-1.5 opacity-40">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
        ))}
      </div>

      <div className="absolute bottom-0 right-0 grid grid-cols-6 gap-1.5 opacity-40">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
        ))}
      </div>

      <div className="absolute bottom-24 left-0 flex flex-col gap-1">
        {[5, 4, 3, 2, 1].map((count, row) => (
          <div key={row} className="flex gap-1 justify-center">
            {[...Array(count)].map((_, i) => (
              <svg key={i} className="w-3 h-3 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2L10 10H2L8 14L6 22L12 17L18 22L16 14L22 10H14L12 2Z" />
              </svg>
            ))}
          </div>
        ))}
      </div>

      <div className="absolute top-8 right-0 flex flex-col gap-1">
        {[1, 2, 3, 2, 1].map((count, row) => (
          <div key={row} className="flex gap-1 justify-center">
            {[...Array(count)].map((_, i) => (
              <svg key={i} className="w-2.5 h-2.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            ))}
          </div>
        ))}
      </div>

      <div className="absolute top-4 right-24">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600 flex items-center justify-center shadow-lg">
          <span className="text-yellow-800 font-bold text-lg">$</span>
        </div>
      </div>

      <div className="absolute bottom-16 left-20">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 border-2 border-blue-600 flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 6v12M6 12h12" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 flex items-end gap-[-20px]">
        <div className="relative w-[160px] h-[320px] bg-white rounded-[2rem] border-[3px] border-slate-800 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-slate-800 rounded-b-xl" />
          <div className="absolute left-0 top-20 w-1.5 h-8 bg-yellow-400 rounded-r" />
          <div className="absolute left-0 top-32 w-1.5 h-8 bg-yellow-400 rounded-r" />
          
          <div className="w-full h-full bg-white flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-slate-800 font-bold text-4xl">$</span>
            </div>
          </div>
        </div>

        <svg className="absolute -left-8 bottom-16 w-10 h-16 text-yellow-400 z-20" viewBox="0 0 40 64" fill="none" stroke="currentColor" strokeWidth={3}>
          <path d="M20 64V20L5 35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <svg className="absolute -right-4 top-8 w-10 h-16 text-yellow-400 z-20" viewBox="0 0 40 64" fill="none" stroke="currentColor" strokeWidth={3}>
          <path d="M20 0V44L35 29" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="relative w-[160px] h-[320px] bg-white rounded-[2rem] border-[3px] border-slate-800 shadow-2xl overflow-hidden -ml-6 mt-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-slate-800 rounded-b-xl" />
          <div className="absolute right-0 top-20 w-1.5 h-8 bg-yellow-400 rounded-l" />
          
          <div className="w-full h-full bg-white flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
