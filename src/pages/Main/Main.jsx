import React from "react";
import "./Main.css";
import Header from "../../components/Header/Header";


export const Main= () => {
  

  return (
    <div className="main">
      <Header/>
      <button onClick={() => window.location.href="/GenereteText"}>Згенерувати текст</button>
      <button onClick={() => window.location.href="/GenereteImage"}>Згенерувати зображення</button>
      <button onClick={() => window.location.href="/GenereteImageAndText"}>Згенерувати текст + зображення</button>
      <button onClick={() => window.location.href="/GenereteImageAndText"}>Стилізувати Ваше фото</button>
    </div>

  );
};
