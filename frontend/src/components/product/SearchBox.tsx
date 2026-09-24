import { Search, X } from 'lucide-react'

type SearchBoxProps = {
  value: string
  onChange: (value: string) => void
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="relative">
      <label htmlFor="sweet-search" className="sr-only">
        Search sweets
      </label>
      <Search
        size={18}
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-maroon-800/60"
      />
      <input
        id="sweet-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search sweets, e.g. Barfi"
        autoComplete="off"
        className="w-full rounded-full border border-cream-200 bg-white py-3 pl-11 pr-10 text-sm placeholder:text-maroon-900/40 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-400/40 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-maroon-800/60 hover:bg-cream-100"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}