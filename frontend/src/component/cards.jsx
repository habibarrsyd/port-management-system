import React from 'react';

const Card = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children} {/* Ini tempat isi data/grafik */}
    </div>
  );
};

export default Card;