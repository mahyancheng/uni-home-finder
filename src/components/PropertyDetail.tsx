
import React from 'react';
import { Property } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PropertyDetailProps {
  property: Property;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ property }) => {
  if (!property) {
    return null;
  }

  // Helper function to format text with line breaks
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className="py-1">{line}</p>
    ));
  };

  return (
    <Card className="w-full my-4">
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-xl font-bold text-blue-700">{property.property_name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold text-blue-600 mb-1">Property Information</h3>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Type:</span> {property.property_type}</p>
              <p><span className="font-medium">Size:</span> {property.property_size}</p>
              <p><span className="font-medium">Price Range:</span> {property.property_price}</p>
              <p><span className="font-medium">Distance to HELP University:</span> {property.distance_to_help_uni}</p>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <h3 className="font-semibold text-blue-600 mb-2">Quick Summary</h3>
            <p className="text-sm text-gray-700">
              {property.property_name} is a {property.property_type.toLowerCase()} located {property.distance_to_help_uni} from HELP University with prices ranging from {property.property_price}.
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-blue-600 mb-2">Room Features</h3>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {formatText(property.room_features)}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-blue-600 mb-2">Amenities & Advantages</h3>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {formatText(property.amenities_advantages)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetail;
