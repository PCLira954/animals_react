export interface Animal {
  id?: number;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  tutorId: number;
  foto: string;
  tutor?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
}

export type Species = Animal['species'];