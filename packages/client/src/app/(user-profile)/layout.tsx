import { ReactNode } from "react";

import ProtectedRoute from "@/components/protected-route";

type UserProfileLayoutProps = {
  children: ReactNode;
};

function UserProfileLayout({ children }: UserProfileLayoutProps) {
  return <>{children}</>;
}

export default ProtectedRoute(UserProfileLayout);
