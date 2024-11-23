export interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface Pagination<T> {
    items: T[];
    info: PaginationInfo;
}