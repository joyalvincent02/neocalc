export function InputSummary({
  title = 'Inputs',
  items,
}: {
  title?: string
  items: { label: string; value: string }[]
}) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-sm font-semibold">{title}</div>
      <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {items.map((i) => (
          <div key={i.label} className="flex items-baseline justify-between gap-3">
            <dt className="text-zinc-600 dark:text-zinc-300">{i.label}</dt>
            <dd className="font-medium">{i.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

