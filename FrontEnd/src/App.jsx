// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';

import Navbar from './components/others/Navbar.jsx';
import Footer from './components/others/Footer.jsx';

import Home from './routes/Home.jsx';

import ListaMetodos from './routes/Methods/ListaMetodos.jsx';
import Metodos from './routes/Methods/Metodos.jsx'
import Lab from './routes/Methods/Lab.jsx'

import NotFoundPage from './routes/Others/NotFound.jsx';
import Creditos from './routes/Others/Creditos.jsx';
import Terms from './routes/Others/Terms.jsx';

import Login from './routes/Auth/Login.jsx';
import AuthCallback from './routes/Auth/AuthCallback.jsx';
import Profile from './routes/Auth/Profile.jsx';

import ProtectedRoute from './routes/Auth/ProtectedRoute.jsx';

import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-layout">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/metodos" element={<ListaMetodos />} />
          <Route path="/metodos/:metodo" element={<Metodos />} />
          <Route path="/lab/:metodo" element={<Lab />} />

          <Route path="/creditos" element={<Creditos />} />
          <Route path="/terminos" element={<Terms />} />

          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route path="/perfil" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <Footer />
      <SpeedInsights />
    </BrowserRouter>
  );
}

export default App;