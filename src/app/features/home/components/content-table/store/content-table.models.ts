export interface ContentTableState {
  display?: "articles" | "users" | "blogs",
  sortBy?: string,
  timeframe?: "day" | "week" | "month" | "quarter" | "year" | "all",
  pageSize?: number,
  pageIndex?: number,
  filterPageIndex?: number,
  orderBy?: "ASC" | "DSC",
  filter?: string,
  collectionSize?: number,
}