import type { ReactNode } from 'react'

type FieldProps = {
  id: string
  label: string
  error?: string
  optional?: boolean
  hint?: string
  children: ReactNode
}

export default function Field({ id, label, error, optional, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {optional && <span className="ml-1 font-normal text-maroon-900/50">(optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-xs text-maroon-900/60">
          {hint}
        </p>
      )}
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}