import { Link, Navigate, Route, Routes } from 'react-router-dom'
import AventurierCreatePage from './pages/AventurierCreatePage'
import AventurierDetailPage from './pages/AventurierDetailPage'
import AventuriersListPage from './pages/AventuriersListPage'
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

  return (
    <div className="app">
      <header className="appHeader">
        <div className="appHeader__inner">
          <h1 className="appHeader__title">Aventuriers</h1>
          <nav className="appHeader__nav" aria-label="Navigation principale">
            <Link to="/aventuriers" className="navLink">
              Liste
            </Link>
            {isAuthenticated && isAdmin ? (
              <Link to="/aventuriers/nouveau" className="navLink navLink--primary">
                Créer
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
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      <SnackbarHost />
    </div>
  )
}
