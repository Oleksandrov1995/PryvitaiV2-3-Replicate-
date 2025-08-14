import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './SignIn.css';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Будь ласка, заповніть всі поля.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'Невірний пароль.' || data.error === 'Користувача не знайдено.') {
          setError('Перевірте пошту і пароль');
        } else {
          setError(data.error || 'Помилка входу');
        }
        setSuccess('');
      } else {
        setSuccess(data.message || 'Вхід успішний!');
        setError('');
        setForm({ email: '', password: '' });
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.dispatchEvent(new Event('storage'));
        }
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      setError('Помилка зʼєднання з сервером');
      setSuccess('');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotMsg('');
    if (!forgotEmail) {
      setForgotMsg('Введіть email');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'Користувача з таким email не знайдено.') {
          setForgotMsg('Користувача з таким email не знайдено.');
        } else {
          setForgotMsg(data.error || 'Помилка надсилання email');
        }
      } else {
        setForgotMsg(data.message || 'Інструкції для відновлення пароля надіслані на email');
      }
    } catch (err) {
      setForgotMsg('Помилка зʼєднання з сервером');
    }
  };

  return (
    <div className="signin-container">
     
      <h2>Вхід</h2>
      {!showForgot ? (
        <form className="signin-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Пароль"
              value={form.password}
              onChange={handleChange}
              style={{ paddingRight: '32px' }}
            />
            <button
              type="button"
              className="eye-btn"
              style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-5 0-9.27-3.11-10.44-7.5a9.77 9.77 0 0 1 1.61-3.16"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.93 0 3.5-1.57 3.5-3.5a3.5 3.5 0 0 0-3.5-3.5c-.47 0-.92.09-1.34.26"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12C2.73 7.11 7 4 12 4s9.27 3.11 10.44 8.5C21.27 16.89 17 20 12 20s-9.27-3.11-10.44-7.5z"/><circle cx="12" cy="12" r="3.5"/></svg>
              )}
            </button>
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button type="submit">Увійти</button>
          <div style={{ marginTop: '10px' }}>
            <button type="button" className="forgot-btn" onClick={() => setShowForgot(true)}>
              Забули пароль?
            </button>
          </div>
        </form>
      ) : (
        <form className="forgot-form" onSubmit={handleForgot}>
          <input
            type="email"
            name="forgotEmail"
            placeholder="Введіть email для відновлення пароля"
            value={forgotEmail}
            onChange={e => setForgotEmail(e.target.value)}
          />
          <button type="submit">Відновити пароль</button>
          {forgotMsg && <div className="forgot-msg">{forgotMsg}</div>}
          <button type="button" style={{ marginTop: '10px' }} onClick={() => setShowForgot(false)}>Назад</button>
        </form>
      )}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <GoogleOAuthProvider clientId="411952234902-th0g5fji6s9cept1tkqmdn8qj5brivhc.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={credentialResponse => {
              fetch('http://localhost:5000/api/google-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential })
              })
                .then(res => res.json())
                .then(data => {
                  if (data.token) {
                    localStorage.setItem('token', data.token);
                    window.dispatchEvent(new Event('storage'));
                    navigate('/');
                  } else {
                    alert(data.error || 'Помилка Google входу');
                  }
                });
            }}
            onError={() => {
              console.log('Google Sign In Failed');
            }}
            text="signin_with"
          />
        </GoogleOAuthProvider>
      </div>
      <div className="signup-link">
        Ще не маєте акаунта?{' '}
        <Link to="/signUp">Зареєструватися</Link>
      </div>
    </div>
  );
};

export default SignIn;
