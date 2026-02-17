import React from 'react';
import ItemDetailView from '@/components/items/ItemDetailView';
import foodItems from '@/data/foodItems.json';
import { notFound } from 'next/navigation';

export default async function ItemPage({ params }) {
  
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const item = foodItems.find((p) => p.id === parseInt(id));

  if (!item) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ItemDetailView item={item} />
    </div>
  );
}