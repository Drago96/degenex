import classNames from "classnames";
import { ReactNode } from "react";

type SkeletonProps = {
  className?: string;
};

type SkeletonContainerProps = SkeletonProps & { children: ReactNode };

export function SkeletonContainer({ className, children }: SkeletonContainerProps) {
  return (
    <div className={classNames("animate-pulse", className)}>{children}</div>
  );
}

export function SkeletonElement({ className }: SkeletonProps) {
  return <div className={classNames("rounded bg-loading", className)}></div>;
}
