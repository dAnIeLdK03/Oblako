import Weather from './pages/Wheater'
import ForecastPage from './pages/ForecastPage.jsx';
import RainChancePage from './pages/RainChancePage.jsx';
import AirQualityPage from './pages/AirQualityPage.jsx';
import UVIndexPage from './pages/UVIndexPage.jsx';
import Navigation from './components/Navigation.jsx';
import { LanguageProvider } from './LanguageContext.jsx'
import { ThemeProvider } from './ThemeContext.jsx'
import { HistoryProvider } from './HistoryContext.jsx';
import AdminStats from './components/AdminStats.jsx';
import Footer from './components/Footer.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import Cookies from './pages/Cookies.jsx';
import About from './pages/About.jsx';
import Blog from './pages/Blog.jsx';
import CookieConsent from './components/CookieConsent.jsx';
import GoogleAnalytics from './components/GoogleAnalytics.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherTips from './pages/WeatherTips.jsx';
import { HelmetProvider } from '@dr.pogodin/react-helmet';

function App() {
  return (
    <HelmetProvider>
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
                    <Route path="/air-quality" element={<AirQualityPage />} />
                    <Route path="/uv-index" element={<UVIndexPage />} />
                    <Route path="/weather-tips" element={<WeatherTips />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/cookies" element={<Cookies />} />
                  </Routes>
                </main>
                <AdminStats />
                <Footer />
              </div>
            </HistoryProvider>
            <CookieConsent />
            <GoogleAnalytics trackingId="G-XXXXXXXXXX" />
          </LanguageProvider>
        </ThemeProvider>
      </Router>
    </HelmetProvider>
  )
}

export default App
