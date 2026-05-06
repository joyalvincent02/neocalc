import { FieldError } from './FieldError'

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  options: { value: string; label: string }[]
  error?: string
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium">{label}</div>
      <select
        className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-400 dark:focus:ring-zinc-800"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </label>
  )
}

