import api from './api'

// Servicios del catálogo de pelsev.io.
export const catalogService = {
  // Datos de la página de inicio: categorías con contenido y sagas.
  home() {
    return api.get('/api/catalog/home/').then((r) => r.data)
  },

  // Listado de películas con filtro opcional por categoría.
  movies(category = '') {
    return api.get('/api/catalog/movies/', { params: { category } }).then((r) => r.data)
  },

  // Detalle de una película.
  movie(id) {
    return api.get(`/api/catalog/movies/${id}/`).then((r) => r.data)
  },

  // Listado de series con filtro opcional por categoría.
  series(category = '') {
    return api.get('/api/catalog/series/', { params: { category } }).then((r) => r.data)
  },

  // Detalle de una serie (incluye temporadas, episodios y progreso).
  seriesDetail(id) {
    return api.get(`/api/catalog/series/${id}/`).then((r) => r.data)
  },

  // Listado de categorías.
  categories() {
    return api.get('/api/catalog/categories/').then((r) => r.data)
  },
}
