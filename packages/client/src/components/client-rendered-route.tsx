import { FC, PropsWithChildren } from "react";

import { useIsHydrated } from "@/hooks/use-is-hydrated";
import Loading from "@/app/loading";

export default function ClientRenderedRoute<PropsT extends PropsWithChildren>(
  WrappedComponent: FC<PropsT>
) {
  function ClientRenderedComponent(props: PropsT) {
    const isHydrated = useIsHydrated();

    if (!isHydrated) {
      return <Loading />;
    }

    return <WrappedComponent {...props} />;
  }

  ClientRenderedComponent.displayName = WrappedComponent.displayName;

  return ClientRenderedComponent;
}
