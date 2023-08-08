import { ButtonHTMLAttributes, forwardRef, ReactNode, Ref } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "button" | "icon" | "link";

const DEFAULT_CLASS_NAME_BY_VARIANT: Record<Variant, string> = {
  button:
    "rounded bg-secondary px-4 py-2 text-secondary-contrastText disabled:bg-secondary-disabled",
  icon: "bg-none text-primary-contrastText dark:text-primary-contrastText-dark",
  link: "text-primary-contrastText focus:outline-none dark:text-primary-contrastText-dark",
};

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function Button(
  { children, className, variant = "button", ...props }: ButtonProps,
  ref: Ref<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      className={twMerge(DEFAULT_CLASS_NAME_BY_VARIANT[variant], className)}
      ref={ref}
    >
      {children}
    </button>
  );
}

export default forwardRef(Button);
