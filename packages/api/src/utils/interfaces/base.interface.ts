export interface ILocale {
  uz: string;
  ru: string;
  en: string;
}

export interface IPaginatedData<T> {
  data: T[];
  paginationInfo: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}
