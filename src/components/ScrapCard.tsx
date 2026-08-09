import React from 'react';

export interface ScrapCardProps {
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  updatedAt: string;
}

const ScrapCard: React.FC<ScrapCardProps> = ({
  name,
  category,
  price,
  unit,
  image,
  updatedAt,
}) => {
  return (
    <div className="bg-brand-card border border-brand-border rounded-card w-[200px] flex-shrink-0 transition-all hover:shadow-md hover:-translate-y-[2px]">
      <div className="bg-brand-bg rounded-t-card flex items-center justify-center">
        <img src={image} alt={name} className="h-32 w-full object-contain p-3" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-brand-text text-sm">{name}</h3>
        <p className="text-xs text-brand-text-secondary mt-0.5">{category}</p>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-brand-primary font-bold text-xl">₹{price}</span>
          <span className="text-sm font-normal text-brand-text-secondary">/{unit}</span>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
          <span className="text-xs text-brand-text-secondary">{updatedAt}</span>
        </div>
      </div>
    </div>
  );
};

export default ScrapCard;
