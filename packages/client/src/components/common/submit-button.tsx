import { ReactNode } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

import Button from "./button";

type SubmitButtonProps = { children: ReactNode; className?: string };

export default function SubmitButton({
  children,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={className}>
      {children}
    </Button>
  );
}
