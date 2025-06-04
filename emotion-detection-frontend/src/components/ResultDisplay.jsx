import React from "react";

const ResultDisplay = ({ result }) => {
  return (
    <div className="glassmorphic mt-6 p-4 w-[95%] max-w-md text-white text-sm md:text-base">
      <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
      <ul className="space-y-1">
        <li>
          <strong>Emotion:</strong> {result.emotion}
        </li>
        <li>
          <strong>Age:</strong> {result.age}
        </li>
        <li>
          <strong>Gender:</strong> {result.gender}
        </li>
        <li>
          <strong>Race:</strong> {result.race}
        </li>
      </ul>
    </div>
  );
};

export default ResultDisplay;
