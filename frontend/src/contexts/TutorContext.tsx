import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Tutor } from '../types';
import tutorService from '../api/tutorService';

type TutorContextType = {
  tutors: Tutor[];
  loading: boolean;
  error: string | null;
  fetchTutors: () => Promise<void>;
  createTutor: (tutor: Omit<Tutor, 'id'>) => Promise<Tutor>;
  updateTutor: (id: number, tutor: Partial<Tutor>) => Promise<void>;
  deleteTutor: (id: number) => Promise<void>;
  getTutor: (id: number) => Tutor | undefined;
};

const TutorContext = createContext<TutorContextType | undefined>(undefined);

export const TutorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTutors = async () => {
    try {
      console.log('Iniciando busca por tutores...');
      setLoading(true);
      setError(null);
      const data = await tutorService.getAll();
      console.log('Tutores recebidos:', data);
      setTutors(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError('Erro ao carregar tutores');
      console.error('Erro ao buscar tutores:', errorMessage);
    } finally {
      console.log('Busca por tutores finalizada');
      setLoading(false);
    }
  };

  const createTutor = async (tutor: Omit<Tutor, 'id'>) => {
    try {
      setLoading(true);
      const newTutor = await tutorService.create(tutor);
      setTutors(prev => [...prev, newTutor]);
      return newTutor;
    } catch (err) {
      setError('Erro ao criar tutor');
      console.error('Erro ao criar tutor:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTutor = async (id: number, tutor: Partial<Tutor>) => {
    try {
      setLoading(true);
      await tutorService.update(id, tutor);
      setTutors(prev => 
        prev.map(t => t.id === id ? { ...t, ...tutor } : t)
      );
    } catch (err) {
      setError('Erro ao atualizar tutor');
      console.error('Erro ao atualizar tutor:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTutor = async (id: number) => {
    try {
      setLoading(true);
      await tutorService.delete(id);
      setTutors(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('Erro ao excluir tutor');
      console.error('Erro ao excluir tutor:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTutor = (id: number) => {
    return tutors.find(tutor => tutor.id === id);
  };

  // Carrega os tutores quando o componente é montado
  useEffect(() => {
    console.log('TutorProvider montado, buscando tutores...');
    fetchTutors();
  }, []);

  return (
    <TutorContext.Provider
      value={{
        tutors,
        loading,
        error,
        fetchTutors,
        createTutor,
        updateTutor,
        deleteTutor,
        getTutor,
      }}
    >
      {children}
    </TutorContext.Provider>
  );
};

export const useTutors = () => {
  const context = useContext(TutorContext);
  if (context === undefined) {
    throw new Error('useTutors deve ser usado dentro de um TutorProvider');
  }
  return context;
};