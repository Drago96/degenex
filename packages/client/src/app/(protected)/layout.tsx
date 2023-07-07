import { ReactNode } from "react";

import ProtectedRoute from "@/components/protected-route";

type ProtectedLayoutProps = {
  children: ReactNode;
};

function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <>{children}</>;
}

export default ProtectedRoute(ProtectedLayout);
