# NeoCalc

Evidence-based neonatal fluid calculation tools for electrolyte and glucose management, built for clinical decision support.

## Features

Three calculators are available from the dashboard:

| Calculator | Purpose |
|---|---|
| **Additive Calculator** | Calculates mL of NaCl / KCl additive required per burette based on patient weight, daily requirement, stock strength, and maintenance rate |
| **Glucose Strengthening** | Determines the optimal mix of base and additive glucose solutions to achieve a target concentration and glucose infusion rate (GIR) |
| **Combined Burette** | All-in-one calculator — reserves space for NaCl, KCl, and calcium gluconate, then solves glucose strengthening in the remaining volume |

Additional features:

- Light / dark theme
- Adjustable rounding precision on all results
- Step-by-step calculation breakdown with rendered equations (KaTeX)
- Inline safety warnings (e.g. peripheral line glucose limits)
- All inputs validated with Zod; errors shown inline

> **Note:** All calculations are for decision-support only. Always verify results with an independent check and confirm against your local hospital formulary and policy.

## Tech Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) (build tool)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives)
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) (forms & validation)
- [React KaTeX](https://github.com/talyssonoc/react-katex) (math rendering)
- [Decimal.js](https://mikemcl.github.io/decimal.js/) (arbitrary-precision arithmetic)
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) (unit tests)

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run all unit tests once |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/              # Router setup and route definitions
├── calculations/     # Pure calculation engines (additive, glucose, combined)
│   └── shared/       # Shared utilities (units, rounding, validation)
├── components/       # Shared UI components (forms, layout, results)
├── config/           # Default protocols, presets, and safety messages
├── features/         # Page-level feature modules (one folder per calculator)
├── hooks/            # Custom React hooks
└── lib/              # General utilities
```

## Calculation Logic

Each calculator's algorithm is documented alongside the implementation:

- [`src/features/additive-calculator/ADDITIVE_CALCULATION.md`](src/features/additive-calculator/ADDITIVE_CALCULATION.md) — 6-step weight-based electrolyte additive algorithm
- [`src/features/glucose-calculator/GLUCOSE_CALCULATION.md`](src/features/glucose-calculator/GLUCOSE_CALCULATION.md) — 8-step hospital quota workflow for glucose strengthening
- [`src/features/combined-burette/COMBINED_BURETTE_CALCULATION.md`](src/features/combined-burette/COMBINED_BURETTE_CALCULATION.md) — 5-phase combined burette algorithm

## Deployment

The project includes a [`vercel.json`](vercel.json) for deployment to [Vercel](https://vercel.com).

```bash
npm run build   # outputs to dist/
```
