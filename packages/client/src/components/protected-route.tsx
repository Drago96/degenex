import { FC, PropsWithChildren } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/services/users.service";

export default function ProtectedRoute<PropsT extends PropsWithChildren>(
  WrappedComponent: FC<PropsT>,
) {
  async function ProtectedComponent(props: PropsT) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      redirect("/");
    }

    return <WrappedComponent {...props} />;
  }

  ProtectedComponent.displayName = WrappedComponent.displayName;

  return ProtectedComponent;
}
