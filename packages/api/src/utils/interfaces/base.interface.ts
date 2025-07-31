export interface ILocale {
  uz: string;
  ru: string;
  en: string;
}

export interface IPaginatedData<T> {
  data: T[];
  paginationInfo: IPaginationInfo;
}

export interface IData<T> {
  data: T;
}

export interface IPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}
