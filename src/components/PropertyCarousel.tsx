
import React from 'react';
import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

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
      <h3 className="text-sm font-medium text-gray-500 mb-3">Found {properties.length} properties:</h3>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: properties.length > 3,
          }}
          className="w-full"
        >
          <CarouselContent>
            {properties.map((property) => (
              <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <div className="p-1">
                  <PropertyCard
                    property={property}
                    onClick={() => onPropertyClick(property)}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {properties.length > 1 && (
            <>
              <CarouselPrevious className="absolute -left-4 top-1/2" />
              <CarouselNext className="absolute -right-4 top-1/2" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default PropertyCarousel;
