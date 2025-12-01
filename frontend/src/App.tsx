import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TutorProvider } from './contexts/TutorContext';
import { AnimalProvider } from './contexts/AnimalContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TutorsList from './pages/TutorsList';
import TutorForm from './components/tutor/TutorForm';
import TutorDetail from './pages/TutorDetail';
import AnimaisList from './pages/AnimalsList';
import AnimalForm from './components/animal/AnimalForm';
import AnimalDetail from './pages/AnimalDetail';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TutorProvider>
          <AnimalProvider>
            <div className="min-h-screen bg-gray-100">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  {/* Rotas Públicas */}
                  <Route path="/login" element={<Login />} />

                  {/* Rotas Protegidas */}
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />

                  {/* Rotas de Tutores */}
                  <Route
                    path="/tutores"
                    element={
                      <PrivateRoute>
                        <TutorsList />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/tutores/novo"
                    element={
                      <PrivateRoute>
                        <TutorForm />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/tutores/:id/editar"
                    element={
                      <PrivateRoute>
                        <TutorForm />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/tutores/:id"
                    element={
                      <PrivateRoute>
                        <TutorDetail />
                      </PrivateRoute>
                    }
                  />

                  {/* Rotas de Animais */}
                  <Route
                    path="/animais"
                    element={
                      <PrivateRoute>
                        <AnimaisList />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/animais/novo"
                    element={
                      <PrivateRoute>
                        <AnimalForm />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/animais/:id/editar"
                    element={
                      <PrivateRoute>
                        <AnimalForm />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/animais/:id"
                    element={
                      <PrivateRoute>
                        <AnimalDetail />
                      </PrivateRoute>
                    }
                  />

                  {/* Rota de fallback para páginas não encontradas */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </AnimalProvider>
        </TutorProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;