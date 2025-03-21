"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../Components/Header";

function ReportContent() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  if (!data) return <p className="text-center text-red-500">No report data found.</p>;

  const report = JSON.parse(data); // Parse the JSON data
  console.log(report);

  return (
    <>
    <Header/>
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <h2 className="text-3xl font-bold text-center text-blue-700">Remedies</h2>
      <div className="p-4 border rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold">Patient Information</h3>
        <p><strong>Description:</strong> {report.description}</p>
      </div>

      {/* Possible Diseases */}
      <div className="p-4 border rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold">Remedies</h3>
        <ul>
          {report.remedies?.map((remedy: any, index: number) => (
            <li key={index}><strong>{remedy.remedy}</strong>: {remedy.instructions}</li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
}

export default function Rreport() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ReportContent />
    </Suspense>
  );
}
