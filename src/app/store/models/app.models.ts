import { ContentTableState } from "src/app/features/home/components/content-table/store/content-table.models";

export interface Token {
  payload: {
    expiresIn: string,
    id: string,
  }
}
export interface User {
  id: string;
  email: string;
  username: string;
  blogIdList: string[],
  imageUrl: string,
  description: string,
  birthdate: string,
  isLoading?: boolean,
}

export interface AppState {
  contentTableSettings: ContentTableState,
  currentUser: User,
}