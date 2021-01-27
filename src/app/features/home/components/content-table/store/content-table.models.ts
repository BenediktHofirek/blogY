export interface ContentTableState {
  display?: "articles" | "authors" | "blogs",
  sortBy?: string,
  timeframe?: "day" | "week" | "month" | "quarter" | "year" | "all",
  pageSize?: number,
  pageIndex?: number,
  orderBy?: "ASC" | "DSC",
  filter?: string,
  collectionSize?: number,
}