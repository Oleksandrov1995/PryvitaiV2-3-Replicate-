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
          <div className="logged-actions">
            <Link to="/userpage" className="user-link" title="Профіль">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
            <button className="logout-btn" onClick={handleLogout}>Вийти</button>
          </div>
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
