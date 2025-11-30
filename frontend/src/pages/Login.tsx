import React from 'react'
import { useForm } from 'react-hook-form'
import api, { setAuthToken } from '../api/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type FormData = {
  email: string
  password: string
}

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>()
  const navigate = useNavigate()
  const { dispatch } = useAuth()

  const onSubmit = async (data: FormData) => {
    try {
      // json-server-auth uses /login which returns { accessToken, user }
      const res = await api.post('/login', data)
      const { accessToken, user } = res.data
      setAuthToken(accessToken)
      dispatch({ type: 'LOGIN', payload: { user, token: accessToken } })
      navigate('/')
    } catch (err) {
      alert('Erro no login: verifique credenciais (use admin@exemplo.com / senha123)')
      console.error(err)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input {...register('email', { required: true })} placeholder="Email" className="border p-2 rounded" />
        <input {...register('password', { required: true })} type="password" placeholder="Senha" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Entrar</button>
      </form>
    </div>
  )
}

export default Login