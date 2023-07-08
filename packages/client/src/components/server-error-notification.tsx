"use client";

import { ReactNode, useEffect } from "react";
import { toast } from "react-toastify";

type ServerErrorNotificationProps = {
  error: string;
  children: ReactNode;
};

export default function ServerErrorNotification({
  error,
  children,
}: ServerErrorNotificationProps) {
  useEffect(() => {
    toast.error(error, { toastId: "server-error-notification" });
  }, [error]);

  return <>{children}</>;
}
