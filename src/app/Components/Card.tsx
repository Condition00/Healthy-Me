"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface CardProps {
  title: string;
  description: string;
  buttonText: string;
  color: string;
  redirect_uri: string;
}

const Card: React.FC<CardProps> = ({ title, description, buttonText, color,redirect_uri = "/"}) => {
  const router = useRouter();

  return (
    <div className="bg-gray-200 rounded-xl shadow-md overflow-hidden w-full max-w-sm">
      {/* Top Color Bar */}
      <div className={`h-3 w-full rounded-t-xl ${color}`}></div>

      {/* Card Content */}
      <div className="p-5">
        <h2 className="font-semibold text-lg text-blue-950">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>

        {/* Button */}
        <button 
          onClick={() => router.push(redirect_uri)}
          className={`mt-4 hover:cursor-pointer w-full py-2 text-white rounded-lg ${color} hover:opacity-80 transition`}
        >
          {buttonText} →
        </button>
      </div>
    </div>
  );
};

export default Card;
