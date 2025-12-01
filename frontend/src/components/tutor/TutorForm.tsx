// frontend/src/components/tutor/TutorForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import type { Tutor } from '../../types';
import { useTutors } from '../../contexts/TutorContext';

type TutorFormData = Omit<Tutor, 'id'>;

const TutorForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const { createTutor, updateTutor, tutors, loading } = useTutors();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TutorFormData>();

  // Se estiver editando, carrega os dados do tutor
  React.useEffect(() => {
    if (isEditing && tutors.length > 0) {
      const tutor = tutors.find(t => t.id === Number(id));
      if (tutor) {
        Object.entries(tutor).forEach(([key, value]) => {
          if (key !== 'id') {
            setValue(key as keyof TutorFormData, String(value));
          }
        });
      }
    }
  }, [id, isEditing, tutors, setValue]);

  const onSubmit: SubmitHandler<TutorFormData> = async (data) => {
    try {
      if (isEditing && id) {
        await updateTutor(Number(id), data);
      } else {
        await createTutor(data);
      }
      navigate('/tutores');
    } catch (err) {
      console.error('Erro ao salvar tutor:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Tutor' : 'Novo Tutor'}
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome *</label>
          <input
            type="text"
            {...register('name', { required: 'Nome é obrigatório' })}
            className={`mt-1 block w-full rounded-md border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            })}
            className={`mt-1 block w-full rounded-md border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            type="tel"
            {...register('phone')}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/tutores')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? 'Salvando...'
              : isEditing
              ? 'Atualizar Tutor'
              : 'Cadastrar Tutor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorForm;