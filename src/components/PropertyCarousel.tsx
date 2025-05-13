
import React from 'react';
import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PropertyCarouselProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

const PropertyCarousel: React.FC<PropertyCarouselProps> = ({
  properties,
  onPropertyClick,
}) => {
  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <div className="w-full my-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Found {properties.length} properties:</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 p-1 pb-4">
          {properties.map((property) => (
            <div key={property.id} className="w-[280px] shrink-0">
              <PropertyCard 
                property={property} 
                onClick={() => onPropertyClick(property)} 
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PropertyCarousel;
