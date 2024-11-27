export interface IPaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IPagination<T> {
    items: T[];
    info: IPaginationInfo;
}