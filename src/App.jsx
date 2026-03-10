import Weather from './pages/Wheater'
import ForecastPage from './pages/ForecastPage.jsx';
import RainChancePage from './pages/RainChancePage.jsx';
import UVIndexPage from './pages/UVIndexPage.jsx';
import Navigation from './components/Navigation.jsx';
import { LanguageProvider } from './LanguageContext.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import { HistoryProvider } from './HistoryContext.jsx';
import Footer from './components/Footer.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Cookies from './pages/Cookies.jsx';
import CookieConsent from './components/CookieConsent.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherTips from './pages/WeatherTips.jsx';


function App() {
  return (
    <Router>
        <ThemeProvider>
          <LanguageProvider>
            <HistoryProvider>
              <div className="app-container">
                <Navigation />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Weather />} />
                    <Route path="/forecast" element={<ForecastPage />} />
                    <Route path="/rain-chance" element={<RainChancePage />} />
                    <Route path="/uv-index" element={<UVIndexPage />} />
                    <Route path="/weather-tips" element={<WeatherTips />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/cookies" element={<Cookies />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </HistoryProvider>
            <CookieConsent />
          </LanguageProvider>
        </ThemeProvider>
      </Router>
  )
}

export default App
