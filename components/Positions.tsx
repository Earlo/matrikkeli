// components/Positions.js
import React from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const Positions = ({ positions }) => {
  return (
    <div className="space-y-4">
      {positions.map((position, index) => (
        <div
          key={index}
          className="rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg"
        >
          <h3 className="text-lg font-semibold">{position.title}</h3>
          <h4 className="text-sm text-gray-500">{position.organization}</h4>
          <p className="text-xs text-gray-400">{`${formatDate(position.start)} - ${formatDate(position.end)}`}</p>
          <p className="mt-2 text-gray-600">{position.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Positions;
