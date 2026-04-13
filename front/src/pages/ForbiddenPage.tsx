import { Link } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'

export default function ForbiddenPage() {
  return (
    <section className="page">
      <header className="pageHeader">
        <h2 className="pageTitle">Accès interdit</h2>
        <div className="pageHeader__actions">
          <Link to="/aventuriers" className="btn">
            Retour à la liste
          </Link>
        </div>
      </header>

      <StatusMessage
        kind="error"
        message="Vous n'avez pas les droits nécessaires pour accéder à cette page."
      />
      <p className="muted">Contactez un administrateur si vous pensez que c’est une erreur.</p>
    </section>
  )
}

