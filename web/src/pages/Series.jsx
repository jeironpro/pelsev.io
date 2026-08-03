import ContentCard from '../components/common/ContentCard'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Spinner from '../components/ui/Spinner'
import { useSeries } from '../hooks/useCatalog'

// Página de series.
export default function Series() {
  const { data: series, loading, error, reload } = useSeries()

  if (error) {
    return (
      <div className="page">
        <ErrorState message={error.message} onRetry={reload} />
      </div>
    )
  }

  if (loading || !series) {
    return (
      <div className="loading">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page__title">Series</h1>
      {series.length === 0 ? (
        <EmptyState message="No hay series disponibles." />
      ) : (
        <div className="catalog-grid">
          {series.map((serie) => (
            <ContentCard key={serie.id} item={serie} type="serie" />
          ))}
        </div>
      )}
    </div>
  )
}
