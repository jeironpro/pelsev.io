import { useCallback, useEffect, useReducer, useRef } from 'react'

const initialState = { data: null, loading: true, error: null }

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { data: action.data, loading: false, error: null }
    case 'FETCH_ERROR':
      return { data: null, loading: false, error: action.error }
    default:
      return state
  }
}

// Hook genérico de petición a la API con estados de carga, error y reintento.
export function useAsyncData(fetcher, deps = []) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const fetcherRef = useRef(fetcher)

  useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  useEffect(() => {
    let active = true
    dispatch({ type: 'FETCH_START' })

    fetcherRef
      .current()
      .then((data) => {
        if (active) dispatch({ type: 'FETCH_SUCCESS', data })
      })
      .catch((error) => {
        if (active) dispatch({ type: 'FETCH_ERROR', error })
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const reload = useCallback(() => {
    dispatch({ type: 'FETCH_START' })
    fetcherRef
      .current()
      .then((data) => dispatch({ type: 'FETCH_SUCCESS', data }))
      .catch((error) => dispatch({ type: 'FETCH_ERROR', error }))
  }, [])

  return { ...state, reload }
}
