// "use client"; // If using Next.js with SSR, uncomment this
import React from "react";
import { useTranslation } from "react-i18next";
import './Hero.css' 
import { useNavigate } from "react-router-dom";

function Card({ icon, title, description, route}) {
  const navigate=useNavigate();
  return (
    // <div className="card">
      <a onClick={()=>navigate(route)} className="card" target="_blank" rel="noopener noreferrer">
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
    { icon: "📞", title: t("navbar.telemedicine"), description: t("cards.telemedicine"), route:"/telemedicine"},
    { icon: "🏥", title: t("navbar.analysis"), description: t("cards.medical_analysis"), route:"/analysis" },
    { icon: "🤖", title: t("navbar.chatbot"), description: t("cards.chatbot"),route:"/chatbot" },
    { icon: "🩺", title: t("navbar.consult"), description: t("cards.consulting"),route:"/consulting" },
    { icon: "🚑", title: "Emergency", description: t("cards.emergency"), route:"/emergency" },
    { icon: "🧑🏻‍⚕️", title: "Book An Appointment", description: t("cards.health_tips"), route:"/appointment" }
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

export default Cards;