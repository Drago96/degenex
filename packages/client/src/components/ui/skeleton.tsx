import classNames from "classnames";
import { twMerge } from "tailwind-merge";

type SkeletonVariant = "text" | "circle";

type SkeletonProps = {
  className?: string;
  variant?: SkeletonVariant;
};

export default function Skeleton({
  className,
  variant = "text",
}: SkeletonProps) {
  return (
    <div
      className={twMerge(
        classNames(
          "h-4 w-full animate-pulse bg-loading",
          {
            rounded: variant === "text",
            "rounded-full": variant === "circle",
          },
          className,
        ),
      )}
    />
  );
}
