export interface Pagination {
    currentPage : number;
    itemsPerPage: number;
    totalItems : number;
    totalPages: Number;
}


export class PaginatedResult<T>{
    result? : T;
    pagination?: Pagination;
}