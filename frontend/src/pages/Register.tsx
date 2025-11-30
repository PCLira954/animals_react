import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api'

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()
  const navigate = useNavigate()
  const password = watch('password', '')

  const onSubmit = async (data: FormData) => {
    try {
      // Remove confirmPassword before sending to the server
      const { confirmPassword, ...userData } = data
      console.log('Enviando dados para registro:', userData)
      
      const response = await api.post('/register', userData)
      console.log('Resposta do servidor:', response.data)
      
      alert('Cadastro realizado com sucesso! Por favor, faça login.')
      navigate('/login')
    } catch (err: any) {
      console.error('Erro detalhado:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        }
      })
      
      if (err.response?.data?.includes('already exists')) {
        alert('Este email já está cadastrado. Por favor, use outro email ou faça login.')
      } else if (err.response?.status === 400) {
        alert('Dados inválidos. Verifique os campos e tente novamente.')
      } else {
        alert(`Erro ao realizar cadastro: ${err.message || 'Tente novamente mais tarde.'}`)
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Criar Conta</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <input 
            {...register('name', { required: 'Nome é obrigatório' })} 
            placeholder="Nome completo" 
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <input 
            {...register('email', { 
              required: 'Email é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })} 
            placeholder="Email" 
            className="w-full border p-2 rounded"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        <div>
          <input 
            {...register('password', { 
              required: 'Senha é obrigatória',
              minLength: {
                value: 6,
                message: 'A senha deve ter pelo menos 6 caracteres'
              }
            })} 
            type="password" 
            placeholder="Senha" 
            className="w-full border p-2 rounded"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        
        <div>
          <input 
            {...register('confirmPassword', {
              validate: value => value === password || 'As senhas não conferem'
            })} 
            type="password" 
            placeholder="Confirme sua senha" 
            className="w-full border p-2 rounded"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Cadastrar
        </button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Register
