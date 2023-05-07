import { HTMLInputTypeAttribute, HTMLProps } from "react";

type InputProps = {
  name: string;
  type?: HTMLInputTypeAttribute;
} & HTMLProps<HTMLInputElement>;

export default function Input({ name, label, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        {...props}
      />
    </div>
  );
}
