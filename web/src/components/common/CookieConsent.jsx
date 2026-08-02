// Banner de consentimiento de cookies.
import { useEffect, useState } from 'react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(() => {
    // Comprobar si ya existe consentimiento en localStorage
    return !(
      typeof window !== 'undefined' &&
      localStorage.getItem('cookieConsentAccepted') === 'true'
    )
  })

  const handleAccept = () => {
    // Guardar consentimiento y ocultar banner
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsentAccepted', 'true')
    }
    setShowBanner(false)
  }

  useEffect(() => {
    // Si el banner no debería mostrarse, salir temprano
    if (!showBanner) return

    // Enfocar el botón de aceptación cuando se monte
    const acceptBtn = document.getElementById('cookie-consent-accept')
    if (acceptBtn) {
      acceptBtn.focus()
    }
  }, [showBanner])

  if (!showBanner) {
    return null
  }

  return (
    <div className="cookie-consent" role="dialog" aria-modal="true">
      <div className="cookie-consent__content">
        <span className="material-icons" aria-hidden="true">
          privacy_tip
        </span>
        <div className="cookie-consent__message">
          <p>
            Utilizamos cookies para mejorar tu experiencia en nuestro sitio. Al
            continuar navegando, aceptas su uso.
          </p>
          <p className="cookie-consent__link">
            <a href="#" target="_blank" rel="noopener noreferrer">
              Más información
            </a>
          </p>
        </div>
        <div className="cookie-consent__actions">
          <button
            type="button"
            id="cookie-consent-accept"
            className="button button--primary"
            onClick={handleAccept}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
