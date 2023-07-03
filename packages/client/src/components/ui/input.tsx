import { forwardRef, HTMLProps, Ref, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import FormField, { FormFieldProps } from "./form-field";

type InputProps = {
  endAdornment?: ReactNode;
} & HTMLProps<HTMLInputElement> &
  Omit<FormFieldProps, "renderField" | "children">;

function Input(
  {
    name,
    label,
    errors,
    endAdornment,
    className,
    containerProps = {},
    labelProps = {},
    errorProps = {},
    ...props
  }: InputProps,
  ref: Ref<HTMLInputElement>
) {
  return (
    <FormField
      name={name}
      label={label}
      errors={errors}
      containerProps={containerProps}
      labelProps={labelProps}
      errorProps={errorProps}
    >
      <input
        id={name}
        name={name}
        className={twMerge(
          "inline-block w-full rounded-lg border border-gray-300 p-2 text-sm placeholder-transparent-contrastText disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none dark:bg-transparent-dark dark:text-primary-contrastText-dark",
          className
        )}
        ref={ref}
        {...props}
      />
      {endAdornment && (
        <span className="absolute right-2 flex">{endAdornment}</span>
      )}
    </FormField>
  );
}

export default forwardRef(Input);
