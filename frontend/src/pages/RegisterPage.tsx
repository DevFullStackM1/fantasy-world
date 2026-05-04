import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'
import { useAuth } from '../auth/useAuth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState<
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'error'; error: string }
  >({ status: 'idle' })

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setState({ status: 'loading' })
    try {
      await register(username, password)
      navigate('/aventuriers', { replace: true })
    } catch (err) {
      setState({
        status: 'error',
        error: err instanceof Error ? err.message : 'Erreur inconnue',
      })
    }
  }

  return (
    <section className="page authPage">
      <header className="pageHeader">
        <h2 className="pageTitle">Inscription</h2>
        <div className="pageHeader__actions">
          <Link to="/login" className="btn">
            J’ai déjà un compte
          </Link>
        </div>
      </header>

      {state.status === 'error' ? (
        <StatusMessage kind="error" message={state.error} />
      ) : null}

      <form className="form cardSurface" onSubmit={onSubmit} aria-label="Inscription">
        <div className="field">
          <label className="label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            disabled={state.status === 'loading'}
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={state.status === 'loading'}
          />
        </div>

        <div className="formActions">
          <button type="submit" className="btn btn--primary" disabled={state.status === 'loading'}>
            {state.status === 'loading' ? 'Création...' : 'Créer le compte'}
          </button>
        </div>
      </form>
    </section>
  )
}

