import React from 'react';
import Card from '../component/cards';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6 mt-40">
      {/* Grid untuk 6 card (3 baris, masing-masing 2 card) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Card 1" />
        <Card title="Card 2" />
        <Card title="Card 3" />
        <Card title="Card 4" />
        <Card title="Card 5" />
        <Card title="Card 6" />
      </div>
      {/* Card terakhir memanjang penuh */}
      <div className="grid grid-cols-1">
        <Card title="Card 7" />
      </div>
    </div>
  );
};

export default Dashboard;