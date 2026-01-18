// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';

import Navbar from './components/others/Navbar.jsx';
import Footer from './components/others/Footer.jsx';

import Home from './routes/Home.jsx';

import Methods from './routes/Methods/Methods.jsx';

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
          <Route path="/metodos" element={<Methods />} />

          <Route path="/creditos" element={<Creditos />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <SpeedInsights />
    </BrowserRouter>
  );
}

export default App;