// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home from './routes/Home.jsx';

import Methods from './routes/Methods/Methods.jsx';

import NotFoundPage from './routes/Others/NotFound.jsx';

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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;