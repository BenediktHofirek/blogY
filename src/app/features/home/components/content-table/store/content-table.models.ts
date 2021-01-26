export interface ContentTableState {
  display: "articles" | "authors" | "blogs",
  sortBy: "newest" | "mostRead" | "highestRated",
  timeframe: "day" | "week" | "month" | "quarter" | "year" | "all",
  itemsPerPage: number,
  pageNumber: number,
  orderBy: "ASC" | "DSC",
  filter: string,
}