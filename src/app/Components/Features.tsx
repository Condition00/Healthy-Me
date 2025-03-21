import React from "react";
import Card from "./Card";
import { redirect } from "next/dist/server/api-utils";
const Features = () => {
  const cards = [
    { title: "Pre-diagnosis Report", description: "Input symptoms for a pre-diagnosis", buttonText: "Get Started", color: "bg-Doc", redirect_uri: "/symptom-checker" },
    { title: "Prescription Reader", description: "Upload a prescription for analysis", buttonText: "Get Started", color: "bg-yellow-500", redirect_uri: "/prescription"},
    { title: "Skin Infection Checker", description: "Check probability of skin infections", buttonText: "Get Started", color: "bg-purple-500", redirect_uri: "/skin-infection-checker"},
    { title: "Common Remedies", description: "Get remedies for common ailments", buttonText: "Get Started", color: "bg-green-700", redirect_uri: "/common-remedies"},
  ];

  return (
    <div className="flex justify-center w-full">
      <div className="grid grid-cols-1 ml-20 md:grid-cols-5 lg:grid-cols-2 gap-5 p-6 bg-blue-50 pb-20 max-w-screen-lg w-full">
        {cards.map((card, index) => (
          <div key={index} className="w-full h-56">
            <Card {...card} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
