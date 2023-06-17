import LoadingIndicator from "@/components/loading-indicator";

export default function Loading() {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-24 w-24 flex-col">
      <LoadingIndicator />
    </div>
  );
}
