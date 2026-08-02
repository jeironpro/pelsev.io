import './categorycard.css'

import { useNavigate } from 'react-router-dom'

// Tarjeta de categoría para la fila de acceso rápido del inicio.
export default function CategoryCard({ category }) {
  const navigate = useNavigate()
  const total = category.movies.length + category.series.length
  const destiny = `/categoria/${category.slug}`

  return (
    <article
      className="category-card"
      role="link"
      tabIndex={0}
      onClick={() => navigate(destiny)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') navigate(destiny)
      }}
      aria-label={`Categoría ${category.name}`}
    >
      <span className="material-icons category-card__icon" aria-hidden="true">
        category
      </span>
      <h3 className="category-card__name">{category.name}</h3>
      <span className="category-card__count">
        {total === 0 ? 'Próximamente' : `${total} título${total === 1 ? '' : 's'}`}
      </span>
    </article>
  )
}
