import React, { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';

type User = {
  id: number;
  email: string;
  name: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
};

type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

type AuthContextType = {
  state: AuthState;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user: User, token: string) => {
    dispatch({
      type: 'LOGIN',
      payload: { user, token },
    });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Carrega o estado do localStorage ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        login(parsedUser, token);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    dispatch({ type: 'LOADING', payload: false });
  }, []);

  // Salva o estado no localStorage quando ele muda
  useEffect(() => {
    if (state.token && state.user) {
      localStorage.setItem('token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [state.token, state.user]);

  if (state.loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;