import api from './api';
import type { Tutor } from '../types';

const tutorService = {
  // Listar todos os tutores
  async getAll() {
    const response = await api.get('/tutors');
    return response.data;
  },

  // Obter um tutor por ID
  async getById(id: number) {
    const response = await api.get(`/tutors/${id}`);
    return response.data;
  },

  // Criar um novo tutor
  async create(tutor: Omit<Tutor, 'id'>) {
    const response = await api.post('/tutors', tutor);
    return response.data;
  },

  // Atualizar um tutor existente
  async update(id: number, tutor: Partial<Tutor>) {
    const response = await api.patch(`/tutors/${id}`, tutor);
    return response.data;
  },

  // Excluir um tutor
  async delete(id: number) {
    await api.delete(`/tutors/${id}`);
  },

  // Listar animais de um tutor
  async getTutorAnimals(tutorId: number) {
    const response = await api.get(`/tutors/${tutorId}/animals`);
    return response.data;
  }
};

export default tutorService;
