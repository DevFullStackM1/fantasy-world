import { useEffect } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import AventurierCreatePage from './pages/AventurierCreatePage'
import AventurierDetailPage from './pages/AventurierDetailPage'
import AventuriersListPage from './pages/AventuriersListPage'
import CompetencesListPage from './pages/CompetencesListPage'
import CompetenceDetailPage from './pages/CompetenceDetailPage'
import CompetenceCreatePage from './pages/CompetenceCreatePage'
import CompetenceEditPage from './pages/CompetenceEditPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForbiddenPage from './pages/ForbiddenPage'
import './styles/aventuriers.css'
import PrivateRoute from './auth/PrivateRoute'
import RequireRole from './auth/RequireRole'
import { useAuth } from './auth/useAuth'
import SnackbarHost from './ui/SnackbarHost'

export default function App() {
  const { user, role, logout, isAuthenticated } = useAuth()
  const isAdmin = role === 'ADMIN'

  useEffect(() => {
    let raf = 0
    const root = document.documentElement

    const onPointerMove = (event: PointerEvent) => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const nx = (event.clientX / window.innerWidth) * 2 - 1
        const ny = (event.clientY / window.innerHeight) * 2 - 1
        root.style.setProperty('--mx', nx.toFixed(4))
        root.style.setProperty('--my', ny.toFixed(4))
      })
    }

    const onLeave = () => {
      root.style.setProperty('--mx', '0')
      root.style.setProperty('--my', '0')
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onLeave)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className="app">
      <header className="appHeader">
        <div className="appHeader__inner">
          <h1 className="appHeader__title">Fantasy World</h1>
          <nav className="appHeader__nav" aria-label="Navigation principale">
            <Link to="/aventuriers" className="navLink">
              Aventuriers
            </Link>
            <Link to="/competences" className="navLink">
              Compétences
            </Link>
            {isAuthenticated && isAdmin ? (
              <Link to="/aventuriers/nouveau" className="navLink navLink--primary">
                Créer aventurier
              </Link>
            ) : null}
            {isAuthenticated ? (
              <button
                type="button"
                className="navLink"
                onClick={() => {
                  void logout()
                }}
              >
                Déconnexion
              </button>
            ) : (
              <Link to="/login" className="navLink">
                Se connecter
              </Link>
            )}
          </nav>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'flex-end' }}>
            {user ? (
              <span className="muted" aria-label="Utilisateur connecté">
                {user.username} {role ? `(${role})` : ''}
              </span>
            ) : (
              <span className="muted">Non connecté</span>
            )}
          </div>
        </div>
      </header>

      <main className="appMain" id="main">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/aventuriers" element={<AventuriersListPage />} />
            <Route path="/aventuriers/:id" element={<AventurierDetailPage />} />
            <Route element={<RequireRole role="ADMIN" />}>
              <Route path="/aventuriers/nouveau" element={<AventurierCreatePage />} />
            </Route>

            <Route path="/competences" element={<CompetencesListPage />} />
            <Route path="/competences/:id" element={<CompetenceDetailPage />} />
            <Route element={<RequireRole role="ADMIN" />}>
              <Route path="/competences/nouvelle" element={<CompetenceCreatePage />} />
              <Route path="/competences/:id/modifier" element={<CompetenceEditPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      <SnackbarHost />
    </div>
  )
}
