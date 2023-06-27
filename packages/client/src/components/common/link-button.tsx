import { ButtonHTMLAttributes, forwardRef, ReactNode, Ref } from "react";
import { twMerge } from "tailwind-merge";

type LinkButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function LinkButton(
  { children, className, ...props }: LinkButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={twMerge(
        "mr-2 px-4 py-2 text-primary-contrastText focus:outline-none dark:text-primary-contrastText-dark",
        className
      )}
      ref={ref}
    >
      {children}
    </button>
  );
}

export default forwardRef(LinkButton);
