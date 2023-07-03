import { ErrorMessage as FormErrorMessage } from "@hookform/error-message";
import { HTMLProps, ReactNode } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import AppErrorMessage from "./error-message";

export type FormFieldProps = {
  name: string;
  label?: string;
  errors?: FieldErrors<FieldValues>;
  containerProps?: HTMLProps<HTMLDivElement>;
  labelProps?: HTMLProps<HTMLLabelElement>;
  errorProps?: HTMLProps<HTMLDivElement>;
  children: ReactNode;
};

export default function FormField({
  name,
  label,
  errors,
  containerProps = {},
  labelProps = {},
  errorProps = {},
  children,
}: FormFieldProps) {
  return (
    <div {...containerProps}>
      <div className="mb-2 text-sm font-medium before:content-['\200b']">
        {label && (
          <label
            htmlFor={name}
            {...labelProps}
            className={twMerge(
              "text-primary-contrastText dark:text-primary-contrastText-dark",
              labelProps.className
            )}
          >
            {label}
          </label>
        )}
      </div>
      <div className="relative flex items-center">{children}</div>
      {errors && (
        <FormErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <AppErrorMessage {...errorProps}>{message}</AppErrorMessage>
          )}
        />
      )}
    </div>
  );
}
