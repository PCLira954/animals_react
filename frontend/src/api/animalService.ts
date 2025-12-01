// frontend/src/api/animalService.ts
import api from './api';
import type { Animal } from '../types/animals';

export const getAnimais = async (): Promise<Animal[]> => {
  const response = await api.get('/animais?_expand=tutor');
  return response.data;
};

export const getAnimalById = async (id: number): Promise<Animal> => {
  const response = await api.get(`/animais/${id}?_expand=tutor`);
  return response.data;
};

export const createAnimal = async (animal: Omit<Animal, 'id'>): Promise<Animal> => {
  const response = await api.post('/animais', animal);
  return response.data;
};

export const updateAnimal = async (id: number, animal: Partial<Animal>): Promise<Animal> => {
  const response = await api.put(`/animais/${id}`, animal);
  return response.data;
};

export const deleteAnimal = async (id: number): Promise<void> => {
  await api.delete(`/animais/${id}`);
};