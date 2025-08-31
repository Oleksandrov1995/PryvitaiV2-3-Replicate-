import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './SignUp.css';
import Header from '../../../components/Header/Header';
import { API_URLS } from '../../../config/api';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Будь ласка, заповніть всі поля.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Паролі не співпадають.');
      return;
    }
    try {
      const res = await fetch(API_URLS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка реєстрації');
        setSuccess('');
      } else {
        setSuccess(data.message || 'Реєстрація успішна!');
        setError('');
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
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

  return (
    <div className="register-container">
      <h2>Реєстрація</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        {/* ...існуючі поля реєстрації... */}
        <input
          type="text"
          name="name"
          placeholder="Ім'я"
          value={form.name}
          onChange={handleChange}
        />
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
        <div style={{ position: 'relative' }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Підтвердіть пароль"
            value={form.confirmPassword}
            onChange={handleChange}
            style={{ paddingRight: '32px' }}
          />
          <button
            type="button"
            className="eye-btn"
            style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            onClick={() => setShowConfirmPassword((v) => !v)}
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-5 0-9.27-3.11-10.44-7.5a9.77 9.77 0 0 1 1.61-3.16"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.93 0 3.5-1.57 3.5-3.5a3.5 3.5 0 0 0-3.5-3.5c-.47 0-.92.09-1.34.26"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12C2.73 7.11 7 4 12 4s9.27 3.11 10.44 8.5C21.27 16.89 17 20 12 20s-9.27-3.11-10.44-7.5z"/><circle cx="12" cy="12" r="3.5"/></svg>
            )}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button type="submit">Зареєструватися</button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <GoogleOAuthProvider clientId="411952234902-th0g5fji6s9cept1tkqmdn8qj5brivhc.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={credentialResponse => {
              fetch(API_URLS.GOOGLE_AUTH, {
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
                    alert(data.error || 'Помилка Google реєстрації');
                  }
                });
            }}
            onError={() => {
              console.log('Google Sign Up Failed');
            }}
            text="signup_with"
          />
        </GoogleOAuthProvider>
      </div>
      <div className="signin-link">
        Вже маєте акаунт?{' '}
        <Link to="/signin">Увійти</Link>
      </div>
    </div>
  );
};

export default SignUp;
