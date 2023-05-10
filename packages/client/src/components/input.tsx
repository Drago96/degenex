import { ErrorMessage as FormErrorMessage } from "@hookform/error-message";
import {
  forwardRef,
  HTMLInputTypeAttribute,
  HTMLProps,
  LegacyRef,
} from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import AppErrorMessage from "./error-message";

type InputProps = {
  name: string;
  type?: HTMLInputTypeAttribute;
  errors?: FieldErrors<FieldValues>;
} & HTMLProps<HTMLInputElement>;

export default forwardRef(function Input(
  { name, label, errors, ...props }: InputProps,
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
      {errors && (
        <FormErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => <AppErrorMessage>{message}</AppErrorMessage>}
        />
      )}
    </div>
  );
});
