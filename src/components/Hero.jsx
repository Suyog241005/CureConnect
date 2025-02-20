// "use client"; // If using Next.js with SSR, uncomment this

import React from "react";
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
  const cards = [
    {
      icon: "📞",
      title: "TeleMedicine",
      description: "Smart Telemedicine for Smarter Health",
      url: "https://example.com/performance"
    },
    {
      icon: "🏥",
      title: "Medical Analysis",
      description: "Get Expert Medical Insights Instantly",
      url: "https://example.com/design"
    },
    {
      icon: "🤖",
      title: "ChatBot",
      description: "Your AI-Powered Medical Assistant.",
      url: "https://example.com/usability"
    },
    {
      icon: "🩺",
      title: "Consulting",
      description: "Instant Healthcare, Anytime, Anywhere.",
      url: "https://example.com/responsive"
    },
    {
      icon: "🚑",
      title: "Emergency",
      description: "Your Health, Our Priority – 24/7.",
      url: "https://example.com/security"
    },
    {
      icon: "🧑🏻‍⚕️",
      title: "Health-Tips",
      description: "Personalized Health Tips, Just for You.",
      url: "https://example.com/innovation"
    }
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