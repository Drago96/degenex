import { forwardRef, HTMLProps, Ref } from "react";
import { twMerge } from "tailwind-merge";

import FormField, { FormFieldProps } from "./form-field";

type SelectProps = {
  options: readonly string[];
} & HTMLProps<HTMLSelectElement> &
  Omit<FormFieldProps, "renderField" | "children">;

function Input(
  {
    options,
    name,
    label,
    errors,
    className,
    containerProps = {},
    labelProps = {},
    errorProps = {},
    ...props
  }: SelectProps,
  ref: Ref<HTMLSelectElement>
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
      <select
        id={name}
        name={name}
        className={twMerge(
          "inline-block w-full rounded-lg border border-gray-300 bg-white p-2 text-sm placeholder-muted-contrastText disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none dark:bg-muted-dark dark:text-primary-contrastText-dark",
          className
        )}
        ref={ref}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export default forwardRef(Input);
