// "use client"; // If using Next.js with SSR, uncomment this

import React from "react";
import { useTranslation } from "react-i18next";
import './Hero.css' 
function Card({ icon, title, description, url}) {
  return (
    // <div className="card">
      <a href={url} className="card" target="_blank" rel="noopener noreferrer">
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      </a>
    // </div>
  )
}

function Cards() {
  const { t } = useTranslation();
  const cards = [
    { icon: "📞", title: t("navbar.telemedicine"), description: t("cards.telemedicine"), url: "#" },
    { icon: "🏥", title: t("navbar.analysis"), description: t("cards.medical_analysis"), url: "#" },
    { icon: "🤖", title: t("navbar.chatbot"), description: t("cards.chatbot"), url: "#" },
    { icon: "🩺", title: t("navbar.consult"), description: t("cards.consulting"), url: "#" },
    { icon: "🚑", title: "Emergency", description: t("cards.emergency"), url: "#" },
    { icon: "🧑🏻‍⚕️", title: "Book An Appointment", description: t("cards.health_tips"), url: "#" }
  ]

  return (
    <div className="hero-section">
      <h1 className="text-2xl font-bold mb-5">Our Features</h1>
      <div className="cards-grid">
        {cards.map((card, index) => (
          <Card
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            url={card.url}
          />
        ))}
      </div>
    </div>
  )
}

export default Cards