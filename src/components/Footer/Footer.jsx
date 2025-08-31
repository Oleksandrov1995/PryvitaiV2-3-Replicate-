import React from "react";
import "./Footer.css";
import logo from "../../images/logo.png"; // Імпорт логотипу
import logoText from "../../images/logoText.png"; // Імпорт текстового логотипу
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Логотип + опис */}
        <div className="footer-brand">
          <div className="logo">
        <Link to="/">
          <img src={logo} alt="Pryvitai Logo" style={{ height: '50px' }} /> <img src={logoText} alt="Pryvitai LogoText" style={{ height: '40px' }} />
        </Link>
      </div>
          <p>
            Ваш помічник у створенні незабутніх привітань на будь-яку подію.
          </p>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        {/* Навігація */}
        <div className="footer-links">
          <div>
            <h4>Продукт</h4>
            <a href="#">Календар</a>
            <a href="#">Галерея</a>
            <a href="#">Тарифи</a>
            <a href="#">Акції</a>
          </div>
          <div>
            <h4>Ресурси</h4>
            <a href="#">Допомога</a>
            <a href="#">FAQ</a>
            <a href="#">Блог</a>
            <a href="#">Підтримка</a>
          </div>
          <div>
            <h4>Компанія</h4>
            <a href="#">Про нас</a>
            <a href="#">Контакти</a>
            <a href="#">Кар'єра</a>
            <a href="#">Партнери</a>
          </div>
        </div>
      </div>

      {/* Копірайт */}
      <div className="footer-bottom">
        © 2024 Привітання. Всі права захищено.
      </div>
    </footer>
  );
};

export default Footer;
