import Weather from './pages/Weather';
import { lazy } from 'react';
import Navigation from './components/Navigation.jsx';
import { LanguageProvider } from './LanguageContext.jsx';
import { ThemeProvider } from './ThemeContext.jsx';
import { HistoryProvider } from './HistoryContext.jsx';
import Footer from './components/Footer.jsx';
import CookieConsent from './components/CookieConsent.jsx';
import OfflineBanner from './components/OfflineBanner.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RouteBoundary } from './components/LazyBoundary.jsx';

// Началната страница е в основния пакет; останалите се зареждат при първо отваряне.
const ForecastPage = lazy(() => import('./pages/ForecastPage.jsx'));
const RainChancePage = lazy(() => import('./pages/RainChancePage.jsx'));
const UVIndexPage = lazy(() => import('./pages/UVIndexPage.jsx'));
const WeatherTips = lazy(() => import('./pages/WeatherTips.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const Cookies = lazy(() => import('./pages/Cookies.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <HistoryProvider>
            <div className="app-container">
              <OfflineBanner />
              <Navigation />
              <main className="main-content">
                <RouteBoundary>
                  <Routes>
                    <Route path="/" element={<Weather />} />
                    <Route path="/forecast" element={<ForecastPage />} />
                    <Route path="/rain-chance" element={<RainChancePage />} />
                    <Route path="/uv-index" element={<UVIndexPage />} />
                    <Route path="/weather-tips" element={<WeatherTips />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </RouteBoundary>
              </main>
              <Footer />
            </div>
          </HistoryProvider>
          <CookieConsent />
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
