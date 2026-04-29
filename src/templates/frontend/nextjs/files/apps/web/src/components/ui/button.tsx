import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary';

type ButtonProps = {
  asChild?: boolean;
  children: ReactNode;
  className?: string;
  variant?: Variant;
} & (
  | ButtonHTMLAttributes<HTMLButtonElement>
  | AnchorHTMLAttributes<HTMLAnchorElement>
);

const variants: Record<Variant, string> = {
  primary:
    'bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:bg-slate-800',
  secondary: 'bg-white text-slate-950 ring-1 ring-slate-200 hover:bg-slate-50',
};

export function Button({
  asChild = false,
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition-all',
    variants[variant],
    className,
  );

  if (asChild) {
    return (
      <span className={classes}>
        {children}
      </span>
    );
  }

  return (
    <button className={classes} type="button" {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
