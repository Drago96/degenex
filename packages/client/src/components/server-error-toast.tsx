"use client";

import { ReactNode, useEffect } from "react";
import { toast } from "react-toastify";

type ServerErrorToastProps = {
  error: string;
  children: ReactNode;
};

export default function ServerErrorToast({
  error,
  children,
}: ServerErrorToastProps) {
  useEffect(() => {
    toast.error(error, { toastId: "server-error-notification" });
  }, [error]);

  return <>{children}</>;
}
