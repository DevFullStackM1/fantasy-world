export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const safeTotalPages = Math.max(1, totalPages)
  const canPrev = currentPage > 1
  const canNext = currentPage < safeTotalPages

  return (
    <nav className="pagination" aria-label="Pagination de la liste des aventuriers">
      <button
        type="button"
        className="btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canPrev}
      >
        Précédent
      </button>

      <div className="pagination__meta" aria-live="polite">
        Page {currentPage} / {safeTotalPages}
      </div>

      <button
        type="button"
        className="btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canNext}
      >
        Suivant
      </button>
    </nav>
  )
}

