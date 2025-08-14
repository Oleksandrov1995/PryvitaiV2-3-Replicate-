import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

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
      <div className="header-logo">
        <Link to="/">Pryvitai</Link>
      </div>
      <nav className="header-nav">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>Вийти</button>
        ) : (
          <>
            <Link to="/SignIn">Вхід</Link>
            <Link to="/">Реєстрація</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
