export type CategoryFilter = string

type CategoryTabsProps = {
  active: CategoryFilter
  categories: string[]
  onChange: (category: CategoryFilter) => void
}

export default function CategoryTabs({ active, categories, onChange }: CategoryTabsProps) {
  const options: CategoryFilter[] = ['All', ...categories]

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map((option) => {
        const isActive = option === active
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${
              isActive
                ? 'border-maroon-800 bg-maroon-800 text-cream-50'
                : 'border-cream-200 bg-white text-maroon-800 hover:bg-cream-100'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}