import type { ReactNode } from 'react'

/**
 * Wraps a wide table so it scrolls horizontally on mobile, with a subtle
 * right-edge fade to hint that more content exists off-screen.
 */
export default function ScrollHintTable({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-2xl border border-cream-200 bg-white">
        {children}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 rounded-r-2xl bg-gradient-to-l from-white to-transparent sm:hidden"
      />
    </div>
  )
}