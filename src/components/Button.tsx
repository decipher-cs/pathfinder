import type { ComponentProps, PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge"

export default function Button(props: PropsWithChildren<ComponentProps<"button">>) {
  const { children, className, ...btnProps } = props
  return (
    <button
      className={twMerge(
        className,
        "w-fit cursor-pointer rounded-md bg-neutral-800 px-4 py-2 font-semibold text-neutral-200 capitalize transition-[color_background] duration-150 hover:bg-neutral-200 hover:text-neutral-800"
      )}
      {...btnProps}
    >
      {children}
    </button>
  )
}
