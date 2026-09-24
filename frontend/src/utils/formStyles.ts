export function inputClasses(hasError: boolean): string {
  return `w-full rounded-xl border bg-white px-4 py-3 text-sm placeholder:text-maroon-900/40 focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-600 focus:ring-red-300'
      : 'border-cream-200 focus:border-gold-500 focus:ring-gold-400/40'
  }`
}