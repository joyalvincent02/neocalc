import { NavLink } from 'react-router-dom'

const linkBase =
  'rounded-md px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600'

export function Navigation() {
  return (
    <nav className="flex items-center gap-1">
      <NavLink
        to="/additives"
        className={({ isActive }) =>
          `${linkBase} ${
            isActive
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900'
          }`
        }
      >
        Additives
      </NavLink>
      <NavLink
        to="/glucose"
        className={({ isActive }) =>
          `${linkBase} ${
            isActive
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900'
          }`
        }
      >
        Glucose
      </NavLink>
      <NavLink
        to="/combined"
        className={({ isActive }) =>
          `${linkBase} ${
            isActive
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900'
          }`
        }
      >
        Combined
      </NavLink>
    </nav>
  )
}

