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
      <h2 className="text-3xl font-bold text-center text-blue-700">Health Report</h2>

      {/* Patient Information */}
      <div className="p-4 border rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold">Patient Information</h3>
        <p><strong>Name:</strong> {report.name}</p>
        <p><strong>Age:</strong> {report.age}</p>
        <p><strong>Gender:</strong> {report.gender}</p>
      </div>

      {/* Symptoms */}
      <div className="p-4 border rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold">Symptoms</h3>
        <ul>
          {report.symptoms?.map((symptom: any, index: number) => (
            <li key={index}><strong>{symptom.name} - {symptom.duration}</strong></li>
          ))}
        </ul>
      </div>

      {/* Medical History */}
      <div className="p-4 border rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold">Medical History</h3>
        {report.medical_history?.length > 0 ? (
          <ul>
            {report.medical_history.map((history: string, index: number) => (
              <li key={index}>{history}</li>
            ))}
          </ul>
        ) : (
          <p>No medical history provided.</p>
        )}
      </div>

      {/* Possible Diseases */}
      <div className="p-4 border rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold">Possible Diseases</h3>
        <ul>
          {report.possible_diseases?.map((disease: any, index: number) => (
            <li key={index}><strong>{disease.name}</strong>: {disease.description} (Probability: {disease.probability}%)</li>
          ))}
        </ul>
      </div>

      {/* Recommended Medications */}
      <div className="p-4 border rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold">Recommended Medications</h3>
        <ul>
          {report.recommended_medications?.map((medication: any, index: number) => (
            <li key={index}><strong>{medication.name}</strong>: {medication.dosage}</li>
          ))}
        </ul>
      </div>

      {/* Recommended Tests */}
      {report.recommended_tests && (
        <div className="p-4 border rounded-lg shadow-md bg-gray-100">
          <h3 className="text-xl font-semibold">Recommended Tests</h3>
          <ul>
            {report.recommended_tests.map((test: any, index: number) => (
              <li key={index}><strong>{test.name}</strong>: {test.check_for}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Notes */}
      {report.additional_notes && (
        <div className="p-4 border rounded-lg shadow-md bg-gray-100">
          <h3 className="text-xl font-semibold">Additional Notes</h3>
          <p>{report.additional_notes}</p>
        </div>
      )}

      {/* Download Report Button */}
      <div className="text-center">
        <button
          onClick={() => {
            window.location.href = `/api/generate-report/download?data=${encodeURI(data.toString())}`
          }}
          className="px-4 py-2 hover:cursor-pointer bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          Download Report
        </button>
      </div>
    </div>
    </>
  );
}

export default function Preport() {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <ReportContent />
    </Suspense>
  );
}