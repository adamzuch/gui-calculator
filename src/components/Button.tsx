import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../utils'

const buttonVariants = cva(
  'shadow text-center rounded-full w-12 h-12 px-3.5 py-2.5 font-semibold text-white focus:ring-4',
  {
    variants: {
      variant: {
        primary:
          'bg-amber-500 hover:bg-amber-400 focus:ring-amber-300 text-black',
        secondary: 'bg-neutral-800 hover:bg-neutral-700 focus:ring-neutral-500',
        tertiary: 'bg-neutral-500 hover:bg-neutral-400 focus:ring-neutral-300',
        destructive: 'bg-rose-700 hover:bg-rose-600 focus:ring-rose-300',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
)

export const Button = ({
  children,
  className,
  variant,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>) => (
  <button
    type="button"
    className={cn(buttonVariants({ variant }), className)}
    {...rest}
  >
    {children}
  </button>
)
