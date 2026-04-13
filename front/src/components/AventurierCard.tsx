import { Link } from 'react-router-dom'
import type { components } from '../api/generated/aventurier'

type Aventurier = components['schemas']['Aventurier']

export default function AventurierCard({ aventurier }: { aventurier: Aventurier }) {
  return (
    <article className="card" aria-label={`Aventurier ${aventurier.nom}`}>
      <h2 className="card__title">
        <Link
          className="card__link"
          to={`/aventuriers/${aventurier.id}`}
          aria-label={`Voir le détail de ${aventurier.nom}`}
        >
          {aventurier.nom}
        </Link>
      </h2>

      <div className="card__meta">
        <div className="kv">
          <dt className="kv__k">ID</dt>
          <dd className="kv__v">{aventurier.id}</dd>
        </div>
        <div className="kv">
          <dt className="kv__k">Classe</dt>
          <dd className="kv__v">{aventurier.classe}</dd>
        </div>
        <div className="kv">
          <dt className="kv__k">Niveau</dt>
          <dd className="kv__v">{aventurier.niveau}</dd>
        </div>
      </div>

      {aventurier.description ? (
        <p className="card__description">{aventurier.description}</p>
      ) : (
        <p className="card__description card__description--muted">
          Pas de description.
        </p>
      )}
    </article>
  )
}

