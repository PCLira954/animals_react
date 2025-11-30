import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Header: React.FC = () => {
  const { state, dispatch } = useAuth()
  const navigate = useNavigate()

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/login')
  }

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">Animals Hotel</Link>
        {state.isAuthenticated && (
          <>
            <Link to="/tutores" className="text-sm">Tutores</Link>
            <Link to="/animais" className="ml-2 text-sm">Animais</Link>
          </>
        )}
      </div>
      <div>
        {state.isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span>{state.user?.name}</span>
            <button onClick={logout} className="px-3 py-1 border rounded">Sair</button>
          </div>
        ) : (
          <Link to="/login" className="px-3 py-1 border rounded">Entrar</Link>
        )}
      </div>
    </header>
  )
}

export default Header