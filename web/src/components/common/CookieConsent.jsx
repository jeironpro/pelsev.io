import { useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '../ui/Button'

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    return (
      typeof window !== 'undefined' &&
      localStorage.getItem('cookieConsentAccepted') !== 'true'
    )
  })

  const accept = () => {
    localStorage.setItem('cookieConsentAccepted', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="alert">
      <span className="material-icons cookie-banner__icon" aria-hidden="true">
        cookie
      </span>
      <div className="cookie-banner__body">
        <p className="cookie-banner__text">
          Usamos cookies propias y de terceros para mejorar tu experiencia.
        </p>
        <Link to="/privacy" className="cookie-banner__more">
          Más información
        </Link>
      </div>
      <div className="cookie-banner__action">
        <Button variant="primary" onClick={accept}>
          Aceptar
        </Button>
      </div>
    </div>
  )
}
