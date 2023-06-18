import { ReactNode } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

import Button from "./button";

type SubmitButtonProps = { children: ReactNode };

export default function SubmitButton({ children }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {children}
    </Button>
  );
}
