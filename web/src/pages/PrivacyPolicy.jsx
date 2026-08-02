// Página de privacidad y uso de cookies.
import './privacy.css'

export default function PrivacyPolicy() {
  return (
    <div className="page">
      <h1 className="page__title">Privacidad y cookies</h1>

      <section className="privacy__section">
        <h2>Qué son las cookies</h2>
        <p>
          Las cookies son pequeños archivos de texto que los sitios web almacenan en tu
          dispositivo para recordar tus preferencias y mejorar tu experiencia de
          navegación.
        </p>
      </section>

      <section className="privacy__section">
        <h2>Cómo las usamos en pelsev.io</h2>
        <p>Utilizamos los siguientes tipos de cookies:</p>
        <ul>
          <li>
            <strong>Cookies técnicas:</strong> necesarias para el funcionamiento del
            sitio, como guardar tu progreso de reproducción y mantener el historial de
            «Continuar viendo».
          </li>
          <li>
            <strong>Cookies de preferencias:</strong> recordamos tus elecciones (por
            ejemplo, la aceptación de cookies) para no mostrarte el mismo aviso cada vez
            que nos visitas.
          </li>
        </ul>
        <p>
          No utilizamos cookies de publicidad ni compartimos tus datos con terceros.
          Toda la información se almacena localmente en tu navegador.
        </p>
      </section>

      <section className="privacy__section">
        <h2>Dónde se guardan los datos</h2>
        <p>
          Tus preferencias y el progreso de reproducción se almacenan únicamente en el
          almacenamiento local de tu navegador (<code>localStorage</code> e{' '}
          <code>IndexedDB</code>). No enviamos estos datos a ningún servidor externo.
        </p>
      </section>

      <section className="privacy__section">
        <h2>Gestionar tus preferencias</h2>
        <p>
          Puedes borrar los datos almacenados por pelsev.io en cualquier momento desde
          la página de Ajustes (limpiar historial de reproducción) o desde la
          configuración de tu navegador (borrar cookies y datos del sitio).
        </p>
      </section>
    </div>
  )
}
