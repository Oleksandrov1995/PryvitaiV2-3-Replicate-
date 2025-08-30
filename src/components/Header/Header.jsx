import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import './Header.css';
import logo from '../../images/logo.png';
import logoText from '../../images/logoText.png';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = () => setIsLoggedIn(!!localStorage.getItem('token'));
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/SignIn';
  };

  return (
    <header className="header">
      {/* Лого */}
      <div className="header-logo">
        <Link to="/">
          <img src={logo} alt="Pryvitai Logo" style={{ height: '50px' }} /> <img src={logoText} alt="Pryvitai LogoText" style={{ height: '40px' }} />
        </Link>
      </div>

      {/* Кнопка "Календар привітань" */}
      <div className="calendar-btn">
        <Link to="/calendar">Календар привітань</Link>
      </div>

      {/* Навігація */}
      <nav className="header-nav">
        <Link to="/tariffs">Тарифи</Link>
        <Link to="/promo">Акції</Link>
        <Link to="/gallery">Галерея</Link>
        <Link to="/events">Події</Link>
      </nav>

      {/* Авторизація */}
      <div className="auth-actions">
        {isLoggedIn ? (
          <>
            <Link to="/userpage" className="user-avatar" title="Профіль">
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
              />
            </Link>
            <button title="Вийти" className="logout-btn" onClick={handleLogout}>
              <FiLogOut />
            </button>
          </>
        ) : (
          <>
            <Link to="/SignIn">Вхід</Link>
            <Link to="/SignUp">Реєстрація</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
