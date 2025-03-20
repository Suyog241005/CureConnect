// import { FaNotesMedical, FaBed, FaClock } from "react-icons/fa";

// "use client"; // If using Next.js with SSR, uncomment this
import React from "react";
import { useTranslation } from "react-i18next";
import "./Hero.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Card({ icon, title, description, route, role }) {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  const handleClick = (e) => {
    e.preventDefault();
    if (route.startsWith("http")) {
      window.location.href = route;
    } else {
      navigate(route);
    }
  };

  return (
    <a onClick={handleClick} className="card" style={{ cursor: "pointer" }}>
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </a>
  );
}

function Cards() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const cards = [
    {
      icon: "📞",
      title: t("navbar.telemedicine"),
      description: t("cards.telemedicine"),
      route: "/telemedicine",
      role: "doctor",
    },
    {
      icon: "🏥",
      title: t("navbar.analysis"),
      description: t("cards.medical_analysis"),
      route: "/analysis",
      role: "doctor",
    },
    {
      icon: "😷",
      title: t("navbar.health_tips"),
      description: t("cards.health_tips"),
      route: "/health",
      role: "patient",
    },
    {
      icon: "🩺",
      title: t("navbar.consult"),
      description: t("cards.consulting"),
      route: "chat",
      role: "doctor",
    },
    {
      icon: "🚑",
      title: t("navbar.emergency"),
      description: t("cards.emergency"),
      route: "/emergency",
      role: "patient",
    },
    {
      icon: "🧑🏻‍⚕️",
      title: t("navbar.appointment"),
      description: t("cards.appointment"),
      route: "/appointment",
      role: "doctor",
    },
  ];

  const filteredCards = cards.filter((card) => {
    if (user && user.role === "doctor") {
      return card.role === "doctor";
    }
    return true; // Patients can access all cards
  });

  return (
    <div className="hero-section">
      {user && user.role == "doctor" ? (
        <div className={"cards-grid-doctor"}>
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
        </div>
      ) : (
        <div className={"cards-grid-patient"}>
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
        </div>
      )}
    </div>
  );
}

const HealthcareCards = () => {
  return (
    <div>
      <div
        className="flex justify-center items-center gap-30 mt-10 mb-20"
        style={{ cursor: "pointer" }}
      >
        {/* Card 1 */}
        <div className="bg-blue-50 shadow-lg  rounded-xl text-center transform translate-y-6 p-14 pb-20  ">
          <h2 className="text-2xl font-bold  ">Telemedicine</h2>
          <p className="text-gray-500 text-sm mt-2">
            Smart Telemedicine for Smarter Health
          </p>
          <div className="mt-8 text-blue-600 text-3xl ">📞</div>
        </div>

        {/* Card 2 */}
        <div
          className="bg-blue-50 shadow-lg  rounded-xl  text-center p-14 pb-20"
          style={{ cursor: "pointer" }}
        >
          <h2 className=" font-bold text-2xl"> Analysis</h2>
          <p className="text-gray-500 text-sm mt-2">
            Get Expert Medical Insights Instantly{" "}
          </p>
          <div className="mt-8 text-blue-600 text-3xl">🏥</div>
        </div>

        {/* Card 3 */}
        <div
          className="bg-blue-50 shadow-lg  rounded-xl  text-center transform translate-y-6 p-14 pb-20"
          style={{ cursor: "pointer" }}
        >
          <h2 className="text-2xl font-bold ">Health Tips</h2>
          <p className="text-gray-500 text-sm mt-2">
            Daily Wellness Tips for a Healthier You
          </p>
          <div className="mt-8 text-blue-600 text-3xl">😷</div>
        </div>
      </div>

      <div
        className="flex justify-center items-center gap-30 mt-10"
        style={{ cursor: "pointer" }}
      >
        {/* Card 4 */}
        <div className="bg-blue-50 shadow-lg  rounded-xl  text-center transform translate-y-6 p-14 pb-20">
          <h2 className="text-2xl font-bold  ">Consult</h2>
          <p className="text-gray-500 text-sm mt-2">
            Instant Healthcar, Anytime, Anywhere{" "}
          </p>
          <div className="mt-8 text-blue-600 text-3xl">🩺</div>
        </div>

        {/* Card 5 */}
        <div
          className="bg-blue-50 shadow-lg  rounded-xl w-96 text-center p-14 pb-20"
          style={{ cursor: "pointer" }}
        >
          <h2 className=" font-bold text-2xl  "> Emergency</h2>
          <p className="text-gray-500 text-sm mt-2">
            Your Health, Our Priority - 24/7{" "}
          </p>
          <div className="mt-8 text-blue-600 text-3xl">🚑</div>
        </div>

        {/* Card 6 */}
        <div
          className="bg-blue-50 shadow-lg  rounded-xl  text-center transform translate-y-6 p-14 pb-20"
          style={{ cursor: "pointer" }}
        >
          <h2 className="text-2xl font-bold ">Appointment</h2>
          <p className="text-gray-500 text-sm mt-2">
            Personalized Health Tips, Just For You{" "}
          </p>
          <div className="mt-8 text-blue-600 text-3xl">🧑🏻‍⚕️</div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareCards;
