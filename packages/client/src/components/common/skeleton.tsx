import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type SkeletonProps = {
  className?: string;
};

type SkeletonContainerProps = SkeletonProps & { children: ReactNode };

export function SkeletonContainer({ className, children }: SkeletonContainerProps) {
  return (
    <div className={twMerge("animate-pulse", className)}>{children}</div>
  );
}

export function SkeletonElement({ className }: SkeletonProps) {
  return <div className={twMerge("rounded bg-loading", className)}></div>;
}
