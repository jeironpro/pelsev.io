import { catalogService } from '../services/catalogService'
import { useAsyncData } from './useAsyncData'

// Hooks de catálogo: envuelven los servicios en useAsyncData para las páginas.
export function useHome() {
  return useAsyncData(() => catalogService.home(), [])
}

export function useMovies(category = '') {
  return useAsyncData(() => catalogService.movies(category), [category])
}

export function useSeries(category = '') {
  return useAsyncData(() => catalogService.series(category), [category])
}

export function useMovie(id) {
  return useAsyncData(() => catalogService.movie(id), [id])
}

export function useSerieDetail(id) {
  return useAsyncData(() => catalogService.seriesDetail(id), [id])
}

export function useCategory(slug) {
  return useAsyncData(async () => {
    const data = await catalogService.home()
    return data.categories.find((category) => category.slug === slug)
  }, [slug])
}
