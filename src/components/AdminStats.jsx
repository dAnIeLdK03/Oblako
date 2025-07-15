import React, { useState, useEffect } from 'react';

const SECRET_PATH = 'my-secret-stats-12345'; // Същото като в server.js
const API_URL = `http://localhost:4000/${SECRET_PATH}`;
const ADMIN_PASSWORD = '08010801'; // Смени с твоя парола

function AdminStats() {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [timer, setTimer] = useState(null);

  // 5-кратно натискане за отключване
  const handleSecretClick = () => {
    if (timer) clearTimeout(timer);
    const newCount = clickCount + 1;
    if (newCount >= 7) {
      setShowLogin(true);
      setClickCount(0);
    } else {
      setClickCount(newCount);
      setTimer(setTimeout(() => setClickCount(0), 1500)); // 1.5 сек. за серията
    }
  };

  // Функция за зареждане на статистиката
  const fetchStats = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStats(data.reverse());
    } catch (err) {
      setError('Грешка при зареждане на статистиката');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true);
      setError('');
      fetchStats();
    } else {
      setError('Грешна парола!');
    }
  };

  // Презареждай статистиката при всяко отваряне на панела
  useEffect(() => {
    if (authorized) fetchStats();
    // eslint-disable-next-line
  }, [authorized]);

  // Бутон за затваряне на прозореца
  const handleClose = () => {
    setShowLogin(false);
    setAuthorized(false);
    setPassword('');
    setStats([]);
    setError('');
  };

  return null;
}

export default AdminStats; 