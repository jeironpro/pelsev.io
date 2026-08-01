import { useEffect, useReducer, useRef } from 'react'

// Hook genérico de petición a la API con estados de carga y error.
export function useFetch(fetcher, deps = []) {
  const [state, dispatch] = useReducer((current, next) => ({ ...current, ...next }), {
    data: null,
    loading: true,
    error: null,
  })
  const fetcherRef = useRef(fetcher)

  useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  useEffect(() => {
    let active = true
    dispatch({ loading: true, error: null })

    fetcherRef
      .current()
      .then((data) => {
        if (active) dispatch({ data, loading: false })
      })
      .catch((error) => {
        if (active) dispatch({ error, loading: false })
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
