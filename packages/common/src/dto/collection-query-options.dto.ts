type OffsetPaginationOptions = {
  page: number;
  pageSize: number;
};

type CursorDirection = 'forwards' | 'backwards';

type CursorPaginationOptions = {
  cursor: Partial<{
    value: number;
    direction: CursorDirection;
  }>;
  pageSize: number;
};

type SortDirection = 'asc' | 'desc';

type SortOptions<T> = {
  by: keyof T;
  direction: SortDirection;
};

type FilterOptions<T> = {
  [key in keyof T]: T[key];
};

export type OffsetBasedQueryOptionsDto<T extends { id: number }> = Partial<
  OffsetPaginationOptions & {
    sort: Partial<SortOptions<T>>;
    filters: Partial<FilterOptions<T>>;
  }
>;

export type CursorBasedQueryOptionsDto<T extends { id: number }> = Partial<
  CursorPaginationOptions & {
    filters: Partial<FilterOptions<T>>;
  }
>;
