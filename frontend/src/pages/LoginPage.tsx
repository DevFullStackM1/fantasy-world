import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'
import { useAuth } from '../auth/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const next = useMemo(() => {
    const params = new URLSearchParams(location.search)
    const raw = params.get('next')
    return raw && raw.startsWith('/') ? raw : '/aventuriers'
  }, [location.search])

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
      await login(username, password)
      navigate(next, { replace: true })
    } catch (err) {
      setState({
        status: 'error',
        error: err instanceof Error ? err.message : 'Erreur inconnue',
      })
    }
  }

  if (isAuthenticated) {
    navigate('/aventuriers', { replace: true })
  }

  return (
    <section className="page authPage">
      <header className="pageHeader">
        <h2 className="pageTitle">Connexion</h2>
        <div className="pageHeader__actions">
          <Link to="/register" className="btn">
            Créer un compte
          </Link>
        </div>
      </header>

      {state.status === 'error' ? (
        <StatusMessage kind="error" message={state.error} />
      ) : null}

      <form className="form cardSurface" onSubmit={onSubmit} aria-label="Authentification">
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
            autoComplete="current-password"
            disabled={state.status === 'loading'}
          />
        </div>

        <div className="formActions" style={{ gap: 10 }}>
          <button type="submit" className="btn btn--primary" disabled={state.status === 'loading'}>
            {state.status === 'loading' ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </form>
    </section>
  )
}

