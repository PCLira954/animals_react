import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnimals } from '../contexts/AnimalContext';

const AnimalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAnimal } = useAnimals();
  const [animal, setAnimal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnimal = async () => {
      try {
        if (id) {
          const data = await getAnimal(Number(id));
          setAnimal(data);
        }
      } catch (error) {
        console.error('Erro ao carregar animal:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnimal();
  }, [id, getAnimal]);

  if (loading) return <div>Carregando...</div>;
  if (!animal) return <div>Animal não encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {animal.nome}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detalhes do animal
            </p>
          </div>
          <button
            onClick={() => navigate(`/animais/${id}/editar`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Editar
          </button>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {animal.nome}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Espécie</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {animal.especie === 'CACHORRO' ? 'Cachorro' : 'Gato'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Raça</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {animal.raca}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Idade</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tutor</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {animal.tutor?.nome || 'N/A'}
              </dd>
            </div>
            {animal.foto && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Foto</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <img
                    src={animal.foto}
                    alt={animal.nome}
                    className="h-40 w-40 object-cover rounded"
                  />
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={() => navigate('/animais')}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Voltar para lista
        </button>
      </div>
    </div>
  );
};

export default AnimalDetail;