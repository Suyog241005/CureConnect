// "use client"; // If using Next.js with SSR, uncomment this
import React from "react";
import { useTranslation } from "react-i18next";
import './Hero.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

function Card({ icon, title, description, route, role }) {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector(state => state.user);

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
  const { user, isAuthenticated } = useSelector(state => state.user);

  const cards = [
    { icon: "📞", title: t("navbar.telemedicine"), description: t("cards.telemedicine"), route: "/telemedicine", role: "doctor" },
    { icon: "🏥", title: t("navbar.analysis"), description: t("cards.medical_analysis"), route: "/analysis", role: "doctor" },
    { icon: "😷", title: t("navbar.health_tips"), description: t("cards.health_tips"), route: "/health", role: "patient" },
    { icon: "🩺", title: t("navbar.consult"), description: t("cards.consulting"), route: "chat", role: "doctor" },
    { icon: "🚑", title: t("navbar.emergency"), description: t("cards.emergency"), route: "/emergency", role: "patient" },
    { icon: "🧑🏻‍⚕️", title: t("navbar.appointment"), description: t("cards.appointment"), route: "/appointment", role: "doctor" }
  ];

  const filteredCards = cards.filter(card => {
    if (user && user.role === "doctor") {
      return card.role === "doctor";
    }
    return true; // Patients can access all cards
  });

  return (
    <div className="hero-section">
      {user && user.role == "doctor" ? <div className={"cards-grid-doctor"}>
        {filteredCards.map((card, index) => (
          <Card
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            role={card.role}
            route={card.route}
          />
        ))}
      </div> : <div className={"cards-grid-patient"}>
        {filteredCards.map((card, index) => (
          <Card
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            role={card.role}
            route={card.route}
          />
        ))}
      </div>}
    </div>
  );
}

export default Cards;