import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TutorsList from './pages/TutorsList'
import TutorForm from './pages/TutorForm'
import TutorDetail from './pages/TutorDetail'
import AnimalsList from './pages/AnimalsList'
import AnimalForm from './pages/AnimalForm'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './contexts/AuthContext'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/tutores" element={<PrivateRoute><TutorsList /></PrivateRoute>} />
              <Route path="/tutor/:id" element={<PrivateRoute><TutorDetail /></PrivateRoute>} />
              <Route path="/tutor/:id/editar" element={<PrivateRoute><TutorForm /></PrivateRoute>} />
              <Route path="/tutor/novo" element={<PrivateRoute><TutorForm /></PrivateRoute>} />
              <Route path="/animais" element={<PrivateRoute><AnimalsList /></PrivateRoute>} />
              <Route path="/animal/novo" element={<PrivateRoute><AnimalForm /></PrivateRoute>} />
              <Route path="/animal/:id" element={<PrivateRoute><AnimalForm /></PrivateRoute>} />
              <Route path="/animal/:id/editar" element={<PrivateRoute><AnimalForm /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App