import React from "react";
import "./ngo.css";

const NGOHome: React.FC = () => {
  const cards = [
    {
      title: "Active Volunteers",
      value: 42,
      description: "Currently engaged in relief work",
      icon: "🙋"
    },
    {
      title: "Pending Requests",
      value: 12,
      description: "Awaiting NGO approval",
      icon: "📩"
    },
    {
      title: "Resources Distributed",
      value: "1,250",
      description: "Food, medical kits, shelter items",
      icon: "📦"
    },
    {
      title: "Locations Covered",
      value: 8,
      description: "Areas receiving aid",
      icon: "📍"
    }
  ];

  return (
    <div className="ngo-home">
      <h2>🏠 NGO Dashboard Home</h2>

      <div className="home-card-grid">
        {cards.map((card, index) => (
          <div key={index} className="home-card">
            
            <div className="home-card-icon">
              {card.icon}
            </div>

            <h3>{card.title}</h3>

            <div className="home-card-value">
              {card.value}
            </div>

            <div className="home-card-desc">
              {card.description}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default NGOHome;