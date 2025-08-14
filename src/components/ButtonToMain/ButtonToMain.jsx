import React from "react";
import "./ButtonToMain.css";


export const ButtonToMain = () => {


  return (
    <button className="button-to-main" onClick={() => window.location.href="/"}>
      На головну
    </button>
  );
};
