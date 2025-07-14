import Weather from './pages/Wheater'
import { LanguageProvider } from './LanguageContext.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import { HistoryProvider } from './HistoryContext.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';
import AdminStats from './components/AdminStats.jsx';
import Footer from './components/Footer.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Cookies from './pages/Cookies.jsx';
import CookieConsent from './components/CookieConsent.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
    <ThemeProvider>
    <LanguageProvider>
          <InstallPrompt />
      <HistoryProvider>
            <Routes>
              <Route path="/" element={<div><Weather/></div>} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
            </Routes>
      </HistoryProvider>
          <AdminStats />
          <Footer />
    </LanguageProvider>
    </ThemeProvider>
      <CookieConsent />
    </Router>
  )
}

export default App
