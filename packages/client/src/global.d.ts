export {};

declare global {
  interface FormData {
    entries: () => Iterable;
  }
}
