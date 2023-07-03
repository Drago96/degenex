import { SkeletonContainer, SkeletonElement } from "../ui/skeleton";

export default function TradingPairPriceSkeleton() {
  return (
    <SkeletonContainer className="flex h-6 w-full flex-col justify-center">
      <SkeletonElement className="h-4" />
    </SkeletonContainer>
  );
}