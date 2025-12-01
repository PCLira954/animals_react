import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTutors } from '../contexts/TutorContext';
import type { Tutor } from '../types';

const TutorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTutor, deleteTutor, loading: _loading } = useTutors();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const tutorData = getTutor(Number(id));
      if (tutorData) {
        setTutor(tutorData);
      } else {
        // Se não encontrar o tutor, redireciona para a lista
        navigate('/tutores');
      }
    }
  }, [id, getTutor, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Tem certeza que deseja excluir este tutor?')) {
      try {
        setIsDeleting(true);
        await deleteTutor(Number(id));
        navigate('/tutores');
      } catch (err) {
        console.error('Erro ao excluir tutor:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!tutor) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{tutor.name}</h1>
            <div className="space-x-2">
              <Link
                to={`/tutores/${tutor.id}/editar`}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Editar
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informações do Tutor</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome</p>
                  <p className="mt-1 text-sm text-gray-900">{tutor.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{tutor.email}</p>
                </div>
                {tutor.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Telefone</p>
                    <p className="mt-1 text-sm text-gray-900">{tutor.phone}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Animais</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Lista de animais aparecerá aqui</p>
                <div className="mt-4">
                  <Link
                    to="/animais/novo"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    + Adicionar Animal
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to="/tutores"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              &larr; Voltar para a lista de tutores
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetail;