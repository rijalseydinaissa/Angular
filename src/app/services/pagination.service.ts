import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  constructor() {}

  getTotalPages(items: any[], pageSize: number): number {
    return Math.ceil(items.length / pageSize);
  }

  getPaginatedItems<T>(items: T[], page: number, pageSize: number): T[] {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }

  getVisiblePages(currentPage: number, totalPages: number): number[] {
    if (totalPages <= 0) return [];
    
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);

    if (currentPage <= 2) {
      end = Math.min(4, totalPages);
    }
    if (currentPage >= totalPages - 1) {
      start = Math.max(1, totalPages - 3);
    }
    if (end < start) end = start;

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
