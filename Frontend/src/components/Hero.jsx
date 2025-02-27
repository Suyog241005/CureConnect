// "use client"; // If using Next.js with SSR, uncomment this
import React from "react";
import { useTranslation } from "react-i18next";
import './Hero.css' 
import { useNavigate } from "react-router-dom";

function Card({ icon, title, description, route }) {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    if (route.startsWith('http')) {
      window.location.href = route;
    } else {
      navigate(route);
    }
  };

  return (
    <a onClick={handleClick} className="card" style={{ cursor: 'pointer' }}>
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </a>
  );
}

function Cards() {
  const { t } = useTranslation();
  const cards = [
    { icon: "📞", title: t("navbar.telemedicine"), description: t("cards.telemedicine"), route:"/telemedicine"},
    { icon: "🏥", title: t("navbar.analysis"), description: t("cards.medical_analysis"), route:"/analysis" },
    { icon: "🤖", title: t("navbar.chatbot"), description: t("cards.chatbot"),route:"/chatbot" },
    { icon: "🩺", title: t("navbar.consult"), description: t("cards.consulting"),route:"http://localhost:3000/" },
    { icon: "🚑", title: t("navbar.emergency"), description: t("cards.emergency"), route:"/emergency" },
    { icon: "🧑🏻‍⚕️", title: t("navbar.appointment"), description: t("cards.appointment"), route:"/appointment" }
  ]

  return (
    <div className="hero-section">
      <div className="cards-grid">
        {cards.map((card, index) => (
          <Card
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            route={card.route}
          />
        ))}
      </div>
    </div>
  )
}

export default Cards;