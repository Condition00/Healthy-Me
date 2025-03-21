"use client";
import React from "react";

const Hero = () => {
  return (
    <div className="bg-blue-50 py-10">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-6xl font-bold text-Doc mb-4">
          Healthy Me
        </h1>
        <p className="text-xl mx-auto text-gray-600 max-w-2xl">
          Your comprehensive health companion for pre-diagnosis report, decoding prescriptions, and more.
        </p>
        {/*Card*/}
        <div className="bg-white rounded-lg p-8 mt-10 shadow-md">
          <div className="flex items-center gap-10 mb-5">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 max-w-5xl mt-10">
                Get Started With Your Health Journey
              </h1>
              <p className="text-gray-600 mt-10">
                Our medical assistant helps you understand your symptoms, generate pre-diagnosis report, decode prescriptions, and more..
              </p>
              <div className="flex flex-col md:flex-row  md:space-y-0 md:space-x-8 mt-10 mr-10 justify-center">
                <button onClick={() => {
                  window.location.href = "/symptom-checker";
                }} className="hover:cursor-pointer bg-Doc hover:bg-white hover:text-Doc hover:border text-white px-2 py-2 rounded font-semibold transition">
                  Get Report →
                </button>
                <button onClick={() => {
                  window.location.href = "/prescription";
                }} className="hover:cursor-pointer bg-white border hover:bg-Doc hover:text-white text-Doc px-2 py-2 rounded font-semibold transition">
                  Analyze Prescription
                </button>
              </div>
            </div>

            <div className="flex-1 justify-evenly">
              <img src="/Images/tree.jpg" alt="Logo" className="object-cover h-150 w-150 rounded-4xl"></img>
            </div>
          </div>
        </div>

        {/*Features*/}
        <h1 className="font-bold text-5xl text-gray-800 mt-30">
          Our Features
        </h1>

      </div>
    </div>
  );
};

export default Hero;