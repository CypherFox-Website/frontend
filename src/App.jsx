// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';

import Navbar from './components/others/Navbar.jsx';
import Footer from './components/others/Footer.jsx';

import Home from './routes/Home.jsx';

import ListaMetodos from './routes/Methods/ListaMetodos.jsx';
import Metodos from './routes/Methods/Metodos.jsx'


import NotFoundPage from './routes/Others/NotFound.jsx';
import Creditos from './routes/Others/Creditos.jsx';

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

          <Route path="/creditos" element={<Creditos />} />

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