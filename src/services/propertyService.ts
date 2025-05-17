import { Property } from '@/types/property';

const API_BASE_URL = 'http://localhost:3000/api';

// Search for properties based on criteria
export async function searchProperties(params: {
  property_type?: string;
  max_distance_minutes?: number;
  keywords?: string;
}): Promise<Property[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.property_type) queryParams.append('property_type', params.property_type);
    if (params.max_distance_minutes) queryParams.append('max_distance_minutes', params.max_distance_minutes.toString());
    if (params.keywords) queryParams.append('keywords', params.keywords);

    const response = await fetch(`${API_BASE_URL}/properties?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
}

// Get detailed information about a specific property
export async function getPropertyDetails(propertyName: string): Promise<Property | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${encodeURIComponent(propertyName)}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting property details:', error);
    throw error;
  }
}
