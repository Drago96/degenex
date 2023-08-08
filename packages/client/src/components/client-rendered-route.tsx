import { FC } from "react";

import { useIsHydrated } from "@/hooks/use-is-hydrated";
import Loading from "@/app/loading";

export default function ClientRenderedRoute(WrappedComponent: FC) {
  function ClientRenderedComponent() {
    const isHydrated = useIsHydrated();

    if (!isHydrated) {
      return <Loading />;
    }

    return <WrappedComponent />;
  }

  ClientRenderedComponent.displayName = WrappedComponent.displayName;

  return ClientRenderedComponent;
}
