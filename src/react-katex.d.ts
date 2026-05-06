declare module 'react-katex' {
  import type { ComponentProps } from 'react'
  export function BlockMath(props: { math: string } & ComponentProps<'div'>): JSX.Element
  export function InlineMath(props: { math: string } & ComponentProps<'span'>): JSX.Element
}
