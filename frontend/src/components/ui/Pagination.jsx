/**
 * Pagination Component
 * Page navigation controls with prev/next and numbered pages
 */

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
  
    // Build page numbers array with ellipsis logic
    const getPageNumbers = () => {
      const pages = [];
      const delta = 2;
  
      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 ||
          i === totalPages ||
          (i >= currentPage - delta && i <= currentPage + delta)
        ) {
          pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
          pages.push('...');
        }
      }
      return pages;
    };
  
    return (
      <div className="flex items-center justify-center gap-2 mt-10">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-700
                     border border-dark-500 text-gray-400 hover:text-white hover:border-brand-500
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
  
        {/* Page numbers */}
        {getPageNumbers().map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="text-gray-600 px-1">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                page === currentPage
                  ? 'bg-brand-500 text-white border border-brand-500'
                  : 'bg-dark-700 border border-dark-500 text-gray-400 hover:text-white hover:border-brand-500'
              }`}
            >
              {page}
            </button>
          )
        )}
  
        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-700
                     border border-dark-500 text-gray-400 hover:text-white hover:border-brand-500
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    );
  };
  
  export default Pagination;