
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  return (
    <Card 
      className="w-full max-w-sm h-64 mx-auto cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4 h-full flex flex-col">
        <h3 className="text-lg font-bold mb-2 text-blue-600">{property.property_name}</h3>
        
        <div className="mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1">
            {property.property_type}
          </span>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-1">
            {property.property_size}
          </span>
        </div>
        
        <div className="text-sm mb-2">
          <p className="font-semibold text-gray-700">Price: <span className="font-normal">{property.property_price}</span></p>
          <p className="font-semibold text-gray-700">Distance: <span className="font-normal">{property.distance_to_help_uni}</span></p>
        </div>
        
        <p className="text-xs text-gray-500 line-clamp-3 flex-grow">
          {property.amenities_advantages.split('\n').slice(0, 2).join(', ')}...
        </p>
        
        <div className="mt-auto">
          <p className="text-sm text-blue-600 hover:underline">View details</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
