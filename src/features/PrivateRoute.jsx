import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const token = useSelector((state) => state.users.token) || localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/sign-in" replace />
  }

  return children
}
