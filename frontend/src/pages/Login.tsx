import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api, { setAuthToken } from '../api/api';

type FormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/login', data);
      const { accessToken, user } = res.data;
      
      // Define o token de autenticação
      setAuthToken(accessToken);
      
      // Atualiza o estado de autenticação
      login(user, accessToken);
      
      // Navega para o dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);
      alert('Erro no login: verifique suas credenciais');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input 
          {...register('email', { required: true })} 
          placeholder="Email" 
          className="border p-2 rounded" 
        />
        <input 
          {...register('password', { required: true })} 
          type="password" 
          placeholder="Senha" 
          className="border p-2 rounded" 
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;