import React from "react";
import "./TariffPlan.css";
import { TarifPlansData } from "../../data/TarifPlansData";

const TariffPlan = () => {
  return (
    <section className="pricing-section">
      <h2 className="pricing-title">Оберіть свій план привітань</h2>
      <div className="plans-container">
        {TarifPlansData.map((plan, index) => (
          <div
            key={index}
            className={`plan-card ${plan.highlighted ? "highlighted" : ""}`}
          >
            <h3>{plan.title}</h3>
            <p className="price">{plan.price}</p>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>✔ {feature}</li>
              ))}
            </ul>
            <button className="plan-btn">Обрати тариф</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TariffPlan;
