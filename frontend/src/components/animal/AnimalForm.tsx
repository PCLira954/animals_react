// frontend/src/components/animal/AnimalForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAnimals } from '../../contexts/AnimalContext';
import { useTutors } from '../../contexts/TutorContext';
import type { Animal, Species } from '../../types/animals';

const racasPorEspecie: Record<Species, string[]> = {
  GATO: ['Siamês', 'Persa', 'Maine Coon', 'Vira-lata', 'Outro'],
  CACHORRO: ['Labrador', 'Poodle', 'Bulldog', 'Vira-lata', 'Outro'],
};

const AnimalForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { 
    addAnimal, 
    updateAnimal, 
    getAnimal, 
    state: { loading } 
  } = useAnimals();
  
  const { tutors } = useTutors();
  const [species, setSpecies] = useState<Species>('CACHORRO');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue: _setValue,
    watch,
    reset
  } = useForm<Omit<Animal, 'id'>>({
    defaultValues: {
      species: 'CACHORRO',
      breed: '',
      name: '',
      age: 0,
      tutorId: undefined,
      foto: ''
    }
  });

  // Observa mudanças no valor do campo species
  const currentSpecies = watch('species');

  useEffect(() => {
    if (currentSpecies) {
      setSpecies(currentSpecies);
    }
  }, [currentSpecies]);

  useEffect(() => {
    if (isEditing && id) {
      const loadAnimal = async () => {
        try {
          const animal = await getAnimal(Number(id));
          if (animal) {
            setSpecies(animal.species);
            // Preenche os campos do formulário com os dados do animal
            reset({
              name: animal.name,
              species: animal.species,
              breed: animal.breed,
              age: animal.age,
              tutorId: animal.tutorId,
              foto: animal.foto || ''
            });
          }
        } catch (error) {
          console.error('Erro ao carregar animal:', error);
        }
      };
      loadAnimal();
    }
  }, [id, isEditing, getAnimal, reset]);

  const onSubmit = async (data: Omit<Animal, 'id'>) => {
    try {
      if (isEditing && id) {
        await updateAnimal(Number(id), data);
      } else {
        await addAnimal(data);
      }
      navigate('/animais');
    } catch (error) {
      console.error('Erro ao salvar animal:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Animal' : 'Novo Animal'}
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
          <label className="block text-sm font-medium text-gray-700">Espécie *</label>
          <select
            {...register('species', { 
              required: 'Espécie é obrigatória'
            })}
            className={`mt-1 block w-full rounded-md border ${
              errors.species ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            disabled={loading}
          >
            <option value="CACHORRO">Cachorro</option>
            <option value="GATO">Gato</option>
          </select>
          {errors.species && (
            <p className="mt-1 text-sm text-red-600">{errors.species.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Raça *</label>
          <select
            {...register('breed', { required: 'Raça é obrigatória' })}
            className={`mt-1 block w-full rounded-md border ${
              errors.breed ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            disabled={loading || !species}
          >
            <option value="">Selecione uma raça</option>
            {racasPorEspecie[species]?.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
          {errors.breed && (
            <p className="mt-1 text-sm text-red-600">{errors.breed.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Idade (anos) *</label>
          <input
            type="number"
            min="0"
            step="0.5"
            {...register('age', { 
              required: 'Idade é obrigatória',
              min: { value: 0, message: 'Idade deve ser maior ou igual a zero' },
              valueAsNumber: true
            })}
            className={`mt-1 block w-full rounded-md border ${
              errors.age ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            disabled={loading}
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tutor *</label>
          <select
            {...register('tutorId', { 
              required: 'Tutor é obrigatório',
              valueAsNumber: true
            })}
            className={`mt-1 block w-full rounded-md border ${
              errors.tutorId ? 'border-red-500' : 'border-gray-300'
            } p-2`}
            disabled={loading || !tutors.length}
          >
            <option value="">Selecione um tutor</option>
            {tutors.map((tutor) => (
              <option key={tutor.id} value={tutor.id}>
                {tutor.name}
              </option>
            ))}
          </select>
          {errors.tutorId && (
            <p className="mt-1 text-sm text-red-600">{errors.tutorId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">URL da Foto</label>
          <input
            type="url"
            {...register('foto')}
            placeholder="https://exemplo.com/foto.jpg"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/animais')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnimalForm;