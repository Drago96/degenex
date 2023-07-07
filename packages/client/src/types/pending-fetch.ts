export type PendingFetch<DataT> =
  | { loading: true }
  | (DataT & { loading?: false });
