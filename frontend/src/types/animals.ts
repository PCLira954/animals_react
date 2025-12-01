export interface Animal {
  id?: number;
  nome: string;
  especie: 'GATO' | 'CACHORRO';
  raca: string;
  idade: number;
  tutorId: number;
  foto: string;
  tutor?: {
    id: number;
    nome: string;
  };
}

export type Especie = Animal['especie'];