import React, { useState } from 'react';

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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true);
      setError('');
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setStats(data.reverse());
      } catch (err) {
        setError('Грешка при зареждане на статистиката');
      }
    } else {
      setError('Грешна парола!');
    }
  };

  // Бутон за затваряне на прозореца
  const handleClose = () => {
    setShowLogin(false);
    setAuthorized(false);
    setPassword('');
    setStats([]);
    setError('');
  };

  if (!showLogin && !authorized) {
    return (
      <button
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          opacity: 0.5,
          background: 'transparent',
          color: '#888',
          border: 'none',
          borderRadius: '50%',
          width: 28,
          height: 28,
          fontSize: 18,
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: 'none',
          transition: 'opacity 0.2s',
        }}
        title=""
        onClick={handleSecretClick}
        tabIndex={-1}
      >
        <span role="img" aria-label="info">ℹ️</span>
      </button>
    );
  }

  if (!authorized) {
    return (
      <div style={{ position: 'fixed', top: 16, right: 16, background: '#222', color: '#fff', padding: 20, borderRadius: 8, zIndex: 9999, minWidth: 260 }}>
        <button onClick={handleClose} style={{ position: 'absolute', top: 6, right: 8, background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }} title="Затвори">✕</button>
        <form onSubmit={handleLogin}>
          <div>Админ достъп</div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Парола"
            style={{ margin: '10px 0', padding: 5 }}
          />
          <button type="submit">Вход</button>
          {error && <div style={{ color: 'red', marginTop: 5 }}>{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, background: '#fff', color: '#222', padding: 20, borderRadius: 8, zIndex: 9999, maxHeight: '60vh', overflowY: 'auto', minWidth: 300 }}>
      <button onClick={handleClose} style={{ position: 'absolute', top: 6, right: 8, background: 'transparent', border: 'none', color: '#222', fontSize: 18, cursor: 'pointer' }} title="Затвори">✕</button>
      <h4>Статистика на посещенията</h4>
      <button onClick={() => { setAuthorized(false); setPassword(''); }}>Изход</button>
      <ul style={{ fontSize: 12, marginTop: 10 }}>
        {stats.length === 0 && <li>Няма посещения</li>}
        {stats.map((v, i) => (
          <li key={i} style={{ marginBottom: 8 }}>
            <b>{v.date}</b><br/>
            IP: {v.ip}<br/>
            UA: {v.userAgent}<br/>
            Ref: {v.referrer}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminStats; 