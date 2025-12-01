// frontend/src/contexts/AnimalContext.tsx
import React, { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import * as animalService from '../api/animalService';
import type { Animal } from '../types/animals';

type AnimalState = {
  animais: Animal[];
  loading: boolean;
  error: string | null;
};

type AnimalAction =
  | { type: 'SET_ANIMAIS'; payload: Animal[] }
  | { type: 'ADD_ANIMAL'; payload: Animal }
  | { type: 'UPDATE_ANIMAL'; payload: Animal }
  | { type: 'REMOVE_ANIMAL'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AnimalState = {
  animais: [],
  loading: false,
  error: null,
};

const animalReducer = (state: AnimalState, action: AnimalAction): AnimalState => {
  switch (action.type) {
    case 'SET_ANIMAIS':
      return { ...state, animais: action.payload, loading: false, error: null };
    case 'ADD_ANIMAL':
      return { 
        ...state, 
        animais: [...state.animais, action.payload],
        loading: false,
        error: null
      };
    case 'UPDATE_ANIMAL':
      return {
        ...state,
        animais: state.animais.map(animal =>
          animal.id === action.payload.id ? action.payload : animal
        ),
        loading: false,
        error: null
      };
    case 'REMOVE_ANIMAL':
      return {
        ...state,
        animais: state.animais.filter(animal => animal.id !== action.payload),
        loading: false,
        error: null
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

type AnimalContextType = {
  state: AnimalState;
  fetchAnimais: () => Promise<void>;
  getAnimal: (id: number) => Promise<Animal>;
  addAnimal: (animal: Omit<Animal, 'id'>) => Promise<Animal>;
  updateAnimal: (id: number, animal: Partial<Animal>) => Promise<Animal>;
  removeAnimal: (id: number) => Promise<void>;
};

const AnimalContext = createContext<AnimalContextType | undefined>(undefined);

export const AnimalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(animalReducer, initialState);

  const fetchAnimais = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const animais = await animalService.getAnimais();
      dispatch({ type: 'SET_ANIMAIS', payload: animais });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar animais';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Erro ao carregar animais:', error);
    }
  }, []);

  const getAnimal = useCallback(async (id: number): Promise<Animal> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const animal = await animalService.getAnimalById(id);
      return animal;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar animal';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Erro ao buscar animal:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const addAnimal = useCallback(async (animalData: Omit<Animal, 'id'>): Promise<Animal> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newAnimal = await animalService.createAnimal(animalData);
      dispatch({ type: 'ADD_ANIMAL', payload: newAnimal });
      return newAnimal;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar animal';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Erro ao adicionar animal:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateAnimal = useCallback(async (id: number, animalData: Partial<Animal>): Promise<Animal> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updatedAnimal = await animalService.updateAnimal(id, animalData);
      dispatch({ type: 'UPDATE_ANIMAL', payload: updatedAnimal });
      return updatedAnimal;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar animal';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Erro ao atualizar animal:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const removeAnimal = useCallback(async (id: number): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await animalService.deleteAnimal(id);
      dispatch({ type: 'REMOVE_ANIMAL', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover animal';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Erro ao remover animal:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Carrega os animais ao iniciar
  useEffect(() => {
    fetchAnimais();
  }, [fetchAnimais]);

  // Cria o valor do contexto com tipagem explícita
  const contextValue: AnimalContextType = useMemo(() => ({
    state,
    fetchAnimais,
    getAnimal,
    addAnimal,
    updateAnimal,
    removeAnimal,
  }), [state, fetchAnimais, getAnimal, addAnimal, updateAnimal, removeAnimal]);

  return (
    <AnimalContext.Provider value={contextValue}>
      {children}
    </AnimalContext.Provider>
  );
};

export const useAnimals = (): AnimalContextType => {
  const context = React.useContext(AnimalContext);
  if (context === undefined) {
    throw new Error('useAnimals deve ser usado dentro de um AnimalProvider');
  }
  return context;
};

export default AnimalContext as React.Context<AnimalContextType>;