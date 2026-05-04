import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function RequireRole({ role }: { role: 'ADMIN' | 'VIEWER' }) {
  const { role: currentRole } = useAuth()

  if (currentRole !== role) {
    return <Navigate to="/forbidden" replace />
  }
  return <Outlet />
}

