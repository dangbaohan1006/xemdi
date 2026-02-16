'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;

        // Preserve existing search params and update page
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7; // Show max 7 page buttons

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
            {/* First Page */}
            <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 glass hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                title="First Page"
            >
                <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-2 px-3 py-2 glass hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Trước</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-zinc-500">
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded-lg font-medium transition-all ${isActive
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                                    : 'glass hover:bg-zinc-700 text-zinc-300'
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            {/* Next Page */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-2 px-3 py-2 glass hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all"
            >
                <span className="hidden sm:inline text-sm font-medium">Sau</span>
                <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 glass hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                title="Last Page"
            >
                <ChevronsRight className="w-4  h-4" />
            </button>
        </div>
    );
}
