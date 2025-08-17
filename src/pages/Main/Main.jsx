import React from "react";
import "./Main.css";
import Header from "../../components/Header/Header";


export const Main= () => {
  

  return (
    <div className="main">
      <Header/>
      <h2>Оберіть яке привітання бажаєте створити:</h2>
      <button onClick={() => window.location.href="/GenereteText"}>Текстове привітання</button>
      {/* <button onClick={() => window.location.href="/GenereteImage"}>Креативне зображення</button> */}
      <button onClick={() => window.location.href="/StylizePhotoForPostcard"}>Стилізувати фото під листівку</button>

    </div>

  );
};
