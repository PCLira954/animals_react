import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TutorProvider } from './contexts/TutorContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TutorsList from './pages/TutorsList';
import TutorForm from './components/tutor/TutorForm';
import TutorDetail from './pages/TutorDetail';

function App() {
  return (
    <AuthProvider>
      <TutorProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-6">
              <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rotas Protegidas */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />

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

                {/* Rota de fallback para páginas não encontradas */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </TutorProvider>
    </AuthProvider>
  );
}

export default App;