export type Theme = "light" | "dark";

export interface PageQuery {
  filter?: string;
  page?: number;
  take?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export interface PageMeta {
  page: number;
  total: number;
  take: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PageMeta;
}
