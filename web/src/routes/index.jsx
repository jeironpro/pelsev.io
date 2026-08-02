import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import Spinner from '../components/ui/Spinner'

// Carga diferida de las páginas para reducir el bundle inicial.
const Home = lazy(() => import('../pages/Home'))
const Categoria = lazy(() => import('../pages/Categoria'))
const Peliculas = lazy(() => import('../pages/Peliculas'))
const Series = lazy(() => import('../pages/Series'))
const DetallePelicula = lazy(() => import('../pages/DetallePelicula'))
const DetalleSerie = lazy(() => import('../pages/DetalleSerie'))
const Reproductor = lazy(() => import('../pages/Reproductor'))
const Ajustes = lazy(() => import('../pages/Ajustes'))
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'))
const NotFound = lazy(() => import('../pages/NotFound'))

// Rutas de la aplicación.
export default function AppRoutes() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:slug" element={<Categoria />} />
        <Route path="/peliculas" element={<Peliculas />} />
        <Route path="/series" element={<Series />} />
        <Route path="/pelicula/:id" element={<DetallePelicula />} />
        <Route path="/serie/:id" element={<DetalleSerie />} />
        <Route path="/reproductor/:tipo/:id" element={<Reproductor />} />
        <Route path="/ajustes" element={<Ajustes />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
