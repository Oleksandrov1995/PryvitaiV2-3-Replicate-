import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const app = express();
app.use(express.json());
app.use(cors());

const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: { type: String, default: null },  
  password: {
    type: String,
    required: true
  },
   galleryImage: {
    type: [String],
    default: []    
  },
});

const User = mongoose.model('User', userSchema);

// Google OAuth endpoint
app.post('/api/google-auth', async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Не передано credential.' });
  }
  try {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, password: '' });
      await user.save();
    }
    const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ message: 'Вхід через Google успішний!', token });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Помилка Google авторизації.' });
  }
});

// Повернути профіль поточного користувача
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('name email phone');
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    res.json({ user });
  } catch (err) {
    console.error('me error:', err);
    res.status(500).json({ error: 'Помилка на сервері.' });
  }
});

// Відновлення пароля: приймає email, надсилає email з посиланням
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email обовʼязковий.' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Користувача з таким email не знайдено.' });
  }
  // Генеруємо токен для відновлення пароля (діє 15 хвилин)
  const resetToken = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  // Налаштування транспорту (Gmail, Ukr.net, Outlook тощо)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Відновлення пароля Pryvitai',
      html: `<p>Для відновлення пароля перейдіть за <a href="${resetLink}">цим посиланням</a>.<br>Посилання дійсне 15 хвилин.</p>`
    });
    res.json({ message: 'Інструкції для відновлення пароля надіслані на email.' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Не вдалося надіслати email.' });
  }
});

// Зміна пароля за токеном
app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Токен і новий пароль обовʼязкові.' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ error: 'Користувача не знайдено.' });
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: 'Пароль успішно змінено!' });
  } catch (err) {
    return res.status(400).json({ error: 'Невірний або прострочений токен.' });
  }
});
// ...existing code...

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Всі поля обовʼязкові.' });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Користувач з таким email вже існує.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  // Генеруємо токен (включаємо name для відображення на фронтенді)
  const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ message: 'Реєстрація успішна!', token });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Користувача не знайдено.' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Невірний пароль.' });
  }
  // Генеруємо токен
  const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ message: 'Вхід успішний!', token });
});

// Оновлення телефону
app.put('/api/update-phone', authMiddleware, async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Номер телефону обовʼязковий.' });
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    user.phone = phone;
    await user.save();
    res.json({ message: 'Телефон оновлено.' });
  } catch (err) {
    console.error('update-phone error:', err);
    res.status(500).json({ error: 'Помилка на сервері.' });
  }
});

// Зміна пароля (поточний + новий)
app.post('/api/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Потрібні обидва паролі.' });
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    // Якщо пароль порожній (наприклад, Google-акаунт), не можна перевірити
    if (!user.password) return res.status(400).json({ error: 'Пароль не встановлено для цього акаунту.' });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Поточний пароль невірний.' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Пароль успішно змінено.' });
  } catch (err) {
    console.error('change-password error:', err);
    res.status(500).json({ error: 'Помилка на сервері.' });
  }
});

// Видалення акаунта
app.delete('/api/delete-account', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Акаунт видалено.' });
  } catch (err) {
    console.error('delete-account error:', err);
    res.status(500).json({ error: 'Помилка на сервері.' });
  }
});


// Додавання зображення до галереї користувача
app.post('/api/users/gallery', authMiddleware, async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'URL зображення є обов\'язковим.' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено.' });
    }

    // Додаємо нове посилання в масив
    user.galleryImage.push(imageUrl);
    await user.save();

    res.status(201).json({ message: 'Зображення успішно додано до галереї.' });
  } catch (err) {
    console.error('Помилка додавання до галереї:', err);
    res.status(500).json({ error: 'Помилка сервера при додаванні зображення.' });
  }
});

// Отримання галереї поточного користувача
app.get('/api/users/gallery', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('galleryImage');
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено.' });
    }
    
    // Форматуємо дані, щоб вони відповідали очікуванням фронтенд-компонента
    const formattedGallery = user.galleryImage.map((url, index) => ({
      id: `${req.user.userId}_${index}`, // Створюємо унікальний ключ
      url: url,
      createdBy: req.user.userId
    }));

    res.json(formattedGallery);
  } catch (err) {
    console.error('Помилка отримання галереї:', err);
    res.status(500).json({ error: 'Помилка сервера при отриманні галереї.' });
  }
});

// Видалення зображення з галереї користувача
app.delete('/api/users/gallery/:index', authMiddleware, async (req, res) => {
  const index = parseInt(req.params.index, 10);

  if (isNaN(index)) {
    return res.status(400).json({ error: 'Невірний індекс зображення.' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено.' });
    }

    if (index < 0 || index >= user.galleryImage.length) {
      return res.status(400).json({ error: 'Індекс поза межами масиву.' });
    }

    // Видаляємо зображення
    const removedImage = user.galleryImage.splice(index, 1);
    await user.save();

    res.json({ message: 'Зображення видалено з галереї.', removedImage });
  } catch (err) {
    console.error('Помилка видалення з галереї:', err);
    res.status(500).json({ error: 'Помилка сервера при видаленні зображення.' });
  }
});


// Middleware для перевірки токена
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Токен не надано' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Невірний токен' });
    req.user = user;
    next();
  });
}

app.listen(5000, () => {
  console.log('Backend запущено на http://localhost:5000');
});
