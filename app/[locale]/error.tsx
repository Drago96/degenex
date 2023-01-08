"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <>
      <div>Something went wrong.</div>
      <button onClick={reset}>Retry</button>
    </>
  );
}
