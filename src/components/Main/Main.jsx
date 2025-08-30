import React from "react";
import "./Main.css";

const Main= () => {
  

  return (
    <div className="main">
        <h1 className="main-title">Ваші свята, наша турбота!</h1>
      <h4 className="main-subtitle">Створюйте незабутні привітання з легкістю. Персоналізуйте, плануйте та надсилайте унікальні листівки для всіх особливих подій.</h4>
      <div className="main-buttons">
      
    
        <button className="main-btn" onClick={() => window.location.href="/StylizePhotoForPostcard"}>Стилізувати фото під листівку</button>
            <button className="main-btn" onClick={() => window.location.href="/GenereteImage"}>Привітання від домашнього улюбленця</button>
       <button className="main-btn" onClick={() => window.location.href="/GenereteText"}>Текстове привітання</button>
      </div>

    </div>

  );
};
export default Main;