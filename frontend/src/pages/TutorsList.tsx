import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTutors } from '../contexts/TutorContext';

const TutorsList: React.FC = () => {
  const { tutors, loading, error, deleteTutor } = useTutors();
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este tutor?')) {
      try {
        setDeleteLoading(id);
        await deleteTutor(id);
      } catch (err) {
        console.error('Erro ao excluir tutor:', err);
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  if (loading && tutors.length === 0) {
    return <div className="p-4">Carregando tutores...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Tutores</h1>
        <Link
          to="/tutores/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Novo Tutor
        </Link>
      </div>

      {tutors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum tutor cadastrado.</p>
          <Link
            to="/tutores/novo"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Cadastrar Primeiro Tutor
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Nome</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Telefone</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tutors.map((tutor) => (
                <tr key={tutor.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link
                      to={`/tutores/${tutor.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {tutor.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{tutor.email}</td>
                  <td className="py-3 px-4">{tutor.phone || '-'}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      to={`/tutores/${tutor.id}/editar`}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(tutor.id!)}
                      disabled={deleteLoading === tutor.id}
                      className="text-red-600 hover:text-red-800 ml-2 disabled:opacity-50"
                    >
                      {deleteLoading === tutor.id ? 'Excluindo...' : 'Excluir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TutorsList;