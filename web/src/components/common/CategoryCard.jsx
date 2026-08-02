import './categorycard.css'

import { useNavigate } from 'react-router-dom'

// Tarjeta de categoría para la fila de acceso rápido del inicio.
export default function CategoryCard({ category }) {
  const navigate = useNavigate()
  const total = category.movies.length + category.series.length
  const destino = `/categoria/${category.slug}`

  return (
    <article
      className="categoria-tarjeta"
      role="link"
      tabIndex={0}
      onClick={() => navigate(destino)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') navigate(destino)
      }}
      aria-label={`Categoría ${category.name}`}
    >
      <span className="material-icons categoria-tarjeta__icono" aria-hidden="true">
        category
      </span>
      <h3 className="categoria-tarjeta__nombre">{category.name}</h3>
      <span className="categoria-tarjeta__cantidad">
        {total === 0 ? 'Próximamente' : `${total} título${total === 1 ? '' : 's'}`}
      </span>
    </article>
  )
}
