// App.jsx
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './routes/Home.jsx';

import './App.css';

import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <>
      <Navbar />
      <main className="main-layout">
        <Home />
      </main>
      <Footer />
    </>
  );
}

export default App;