import classNames from "classnames";
import { ButtonHTMLAttributes, forwardRef, ReactNode, Ref } from "react";

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
      className={classNames(
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
