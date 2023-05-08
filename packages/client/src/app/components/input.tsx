import {
  forwardRef,
  HTMLInputTypeAttribute,
  HTMLProps,
  LegacyRef,
} from "react";

type InputProps = {
  name: string;
  type?: HTMLInputTypeAttribute;
} & HTMLProps<HTMLInputElement>;

export default forwardRef(function Input(
  { name, label, ...props }: InputProps,
  ref: LegacyRef<HTMLInputElement>
) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-primary-contrastText dark:text-primary-contrastText-dark"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm placeholder-transparent-contrastText dark:bg-transparent-dark dark:text-primary-contrastText-dark"
        ref={ref}
        {...props}
      />
    </div>
  );
});
