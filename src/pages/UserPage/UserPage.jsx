import React, { useEffect, useState } from 'react';
import './UserPage.css';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneMsg, setPhoneMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmNewPw, setConfirmNewPw] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          // invalid token or other error
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('storage'));
          navigate('/signin');
          return;
        }
        const data = await res.json();
        if (data && data.user) {
          setName(data.user.name || '');
          setEmail(data.user.email || '');
          setPhone(data.user.phone || '');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
        navigate('/signin');
      }
    };

    fetchProfile();
  }, [navigate]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    setPhoneMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/update-phone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (!res.ok) {
        setPhoneMsg(data.error || 'Не вдалося оновити телефон');
      } else {
        setPhoneMsg(data.message || 'Телефон оновлено');
      }
    } catch (err) {
      setPhoneMsg('Помилка зʼєднання з сервером');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg('');
    if (!currentPw || !newPw) {
      setPwMsg('Заповніть обидва поля');
      return;
    }
    if (newPw !== confirmNewPw) {
      setPwMsg('Новий пароль та підтвердження не збігаються');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw })
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMsg(data.error || 'Не вдалося змінити пароль');
      } else {
        setPwMsg(data.message || 'Пароль змінено');
        setCurrentPw('');
        setNewPw('');
        setConfirmNewPw('');
      }
    } catch (err) {
      setPwMsg('Помилка зʼєднання з сервером');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Ви впевнені, що хочете видалити акаунт? Цю дію не можна скасувати.')) return;
    try {
      const res = await fetch('http://localhost:5000/api/delete-account', {
        method: 'DELETE',
        headers: {
          ...getAuthHeader()
        }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Не вдалося видалити акаунт');
      } else {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
        navigate('/');
      }
    } catch (err) {
      alert('Помилка зʼєднання з сервером');
    }
  };

  return (
    <div className="userpage-container">
      <h2>Профіль користувача</h2>
      <div className="user-info">
        <div><strong>Ім'я:</strong> {name || '—'}</div>
        <div><strong>Email:</strong> {email || '—'}</div>
      </div>

      <section className="card">
        <h3>Телефон</h3>
        <form onSubmit={handleUpdatePhone} className="small-form">
          <input type="text" placeholder="Номер телефону" value={phone} onChange={e => setPhone(e.target.value)} />
          <button type="submit">Оновити телефон</button>
        </form>
        {phoneMsg && <div className="msg">{phoneMsg}</div>}
      </section>

      <section className="card">
        <h3>Змінити пароль</h3>
        <form onSubmit={handleChangePassword} className="small-form">
          <input type="password" placeholder="Поточний пароль" value={currentPw} onChange={e => setCurrentPw(e.target.value)} />
          <input type="password" placeholder="Новий пароль" value={newPw} onChange={e => setNewPw(e.target.value)} />
          <input type="password" placeholder="Підтвердіть новий пароль" value={confirmNewPw} onChange={e => setConfirmNewPw(e.target.value)} />
          <button type="submit">Змінити пароль</button>
        </form>
        {pwMsg && <div className="msg">{pwMsg}</div>}
      </section>

      <section className="card danger">
        <h3>Видалити профіль</h3>
        <button className="delete-btn" onClick={handleDeleteAccount}>Видалити профіль</button>
      </section>
    </div>
  );
};

export default UserPage;
