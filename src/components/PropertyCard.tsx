
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Property } from '@/lib/types';
import { Building2 } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  // Get a consistent but different image for each property based on its ID
  const getImageUrl = (id: number) => {
    const imageIds = ['photo-1649972904349-6e44c42644a7', 'photo-1488590528505-98d2b5aba04b', 
                     'photo-1518770660439-4636190af475', 'photo-1461749280684-dccba630e2f6', 
                     'photo-1486312338219-ce68d2c6f44d'];
    const index = id % imageIds.length;
    return `https://images.unsplash.com/${imageIds[index]}?auto=format&fit=crop&w=600&h=400&q=80`;
  };

  return (
    <Card 
      className="w-full max-w-sm h-[380px] mx-auto cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-0 h-full flex flex-col overflow-hidden">
        {/* Property Image */}
        <div className="w-full h-[160px] overflow-hidden relative bg-gray-100">
          <img 
            src={getImageUrl(property.id)}
            alt={property.property_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = ''; 
              e.currentTarget.className = 'hidden';
            }}
          />
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 text-xs m-2 rounded">
            {property.property_type}
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold mb-2 text-blue-600">{property.property_name}</h3>
          
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
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
          
          <div className="mt-auto pt-2 border-t border-gray-100">
            <p className="text-sm text-blue-600 hover:underline flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              View details
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
