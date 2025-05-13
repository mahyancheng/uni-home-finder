
import { pool } from '@/lib/db';
import { Property, PropertySearchParams } from '@/lib/types';

// Search for properties based on criteria
export async function searchProperties(params: PropertySearchParams): Promise<Property[]> {
  try {
    let queryText = 'SELECT * FROM properties WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    // Add conditions based on parameters
    if (params.property_type) {
      queryText += ` AND property_type = $${paramIndex}`;
      queryParams.push(params.property_type);
      paramIndex++;
    }

    if (params.max_price) {
      // This is a simplification - in reality extracting numeric values from strings like "RM850–RM3,300"
      // would require more complex parsing in a real database
      queryText += ` AND property_price LIKE '%RM' || $${paramIndex} || '%'`;
      queryParams.push(params.max_price);
      paramIndex++;
    }

    if (params.max_distance_minutes) {
      // Here we're looking for properties where the distance includes a number less than the max_distance_minutes
      queryText += ` AND distance_to_help_uni LIKE '%' || $${paramIndex} || ' minutes%'`;
      queryParams.push(params.max_distance_minutes);
      paramIndex++;
    }

    if (params.keywords) {
      // Search for keywords in room features and amenities
      queryText += ` AND (room_features ILIKE '%' || $${paramIndex} || '%' OR amenities_advantages ILIKE '%' || $${paramIndex} || '%')`;
      queryParams.push(params.keywords);
      paramIndex++;
    }

    queryText += ' LIMIT 5';  // Limit to 5 results for the carousel

    // For demo purposes, if this was a real implementation, we'd connect to the actual database
    // However, in this case, we'll return mock data matching the query criteria
    
    // Simulate database query to the frontend
    const mockResult = await mockDbQuery(queryText, queryParams);
    return mockResult;

  } catch (error) {
    console.error('Error searching properties:', error);
    return [];
  }
}

// Get detailed information about a specific property
export async function getPropertyDetails(propertyName: string): Promise<Property | null> {
  try {
    // Simulate database query
    const properties = await mockDbQuery(
      'SELECT * FROM properties WHERE property_name = $1',
      [propertyName]
    );

    if (properties.length > 0) {
      return properties[0];
    }
    return null;
  } catch (error) {
    console.error('Error getting property details:', error);
    return null;
  }
}

// Mock database for demo purposes since we're not connecting to a real database in this frontend-only demo
// In a real application, this would be replaced by actual database queries
async function mockDbQuery(query: string, params: any[]): Promise<Property[]> {
  console.log('Mock DB Query:', query, params);
  
  // Mock database with our property data
  const mockDb: Property[] = [
    {
      id: 1,
      property_name: 'Nadayu 801',
      property_type: 'Condominium',
      property_size: '120–1,151 sqft',
      property_price: 'RM850–RM3,300',
      distance_to_help_uni: '10 minutes (via public transport)',
      room_features: 'Single Room (150–300 sqft, RM850–1,000): Fully furnished, shared bathroom, ideal for individual students \n Master Room (220–240 sqft, RM900–1,000): Fully furnished, private bathroom, balcony \n 3-Bedroom Unit (1,033–1,151 sqft, RM1,800–2,700): 3 bedrooms, 4 bathrooms, includes 2 car parks \n 4-Bedroom Unit (~1,079 sqft, RM2,300–3,300): 4 bedrooms, 4 bathrooms, includes 2 car parks',
      amenities_advantages: '24-hour security, CCTV, access card \n Swimming pool, badminton court, gym, sky lounge, BBQ area, playground \n High ceilings, large windows, ensuite bathrooms \n Free washing machine & dryer \n Near food outlets (Zus Coffee, Village Grocer, 99 Speedmart, etc.) \n Private lobbies, shuttle bus to HELP',
    },
    {
      id: 2,
      property_name: 'DK Impian',
      property_type: 'Apartment',
      property_size: 'Varies (Studios, Shared Rooms)',
      property_price: 'RM900–RM1,100',
      distance_to_help_uni: '10 minutes (public transport; traffic may reach 1 hour)',
      room_features: 'Shared Room: RM900 (partially furnished) \n Studio: RM1,100 (fully furnished), private bathroom',
      amenities_advantages: 'Infinity pool, gym, sky lounge, BBQ area, reflexology path \n Children\'s playground, 24-hour security, access card entry \n Air conditioning, new building, modern design \n Shuttle available, near MRT and DASH',
    },
    {
      id: 3,
      property_name: 'Shop Lot Hostel',
      property_type: 'Shop Lot',
      property_size: '80–360 sqft',
      property_price: 'RM480–RM1,200',
      distance_to_help_uni: '3 minutes (walking distance)',
      room_features: 'Low Cost Room (80–120 sqft, RM480–600): Shared bathroom, some without windows \n Premium Room (80–120 sqft, RM1,000–1,200): Private bathroom, with balcony and windows \n 2-Bedroom Unit (240–360 sqft, RM700/pax): Fully furnished, private/shared options',
      amenities_advantages: 'Extremely close to HELP \n Surrounded by food and marts (Mixue, 7-11, CU Mart, etc.) \n High safety: bomba certified, insured, anti-fire door \n Affordable pricing, fully furnished, shared/common area \n Cost-effective option for students',
    },
    {
      id: 4,
      property_name: 'Subang Residences (Landed)',
      property_type: 'Landed',
      property_size: 'Varies (Multiple rooms in house)',
      property_price: 'RM500–RM700 per room',
      distance_to_help_uni: '8 minutes (shuttle provided)',
      room_features: 'Single/shared rooms in 3-storey terrace homes \n Some en-suite bathrooms, others shared',
      amenities_advantages: 'Gated & guarded community \n Shuttle to campus, spacious living \n Feels like home with living & dining space \n Close-knit student environment',
    },
    {
      id: 5,
      property_name: 'Damai Apartment',
      property_type: 'Apartment',
      property_size: '3–4 Bedroom Units',
      property_price: 'RM400–RM600 per room',
      distance_to_help_uni: '3 minutes (walking distance)',
      room_features: 'Small Room: RM400+, shared bathroom \n Medium/Large Room: RM500–600, some en-suite \n Basic furnishing, WiFi often included',
      amenities_advantages: 'Affordable, close to campus \n Guarded entrance, small pool, common area \n Shops and eateries within walking distance \n Great for budget-conscious students',
    },
    {
      id: 6,
      property_name: 'Atria Residence',
      property_type: 'Apartment',
      property_size: 'Varies (Limited units)',
      property_price: 'RM450–RM700 per room',
      distance_to_help_uni: '5–7 minutes (shuttle available)',
      room_features: 'Rooms in low-rise apartment blocks \n Furnished, some with attached bath \n Quiet environment, less crowded',
      amenities_advantages: 'Low-density, quiet student area \n Secure, gated compound \n Close to shops, shuttle to campus \n Ideal for privacy-seeking students',
    },
    {
      id: 7,
      property_name: 'Embayu @ Damansara West',
      property_type: 'Condominium',
      property_size: '3-Bedroom Units (~1,000+ sqft)',
      property_price: 'RM700–RM1,100 per room',
      distance_to_help_uni: '5–10 minutes (drive or shuttle)',
      room_features: 'Master Room: ~RM1,100 with bath \n Middle Room: RM850+ \n Single Room: RM700+',
      amenities_advantages: 'New condo with pool, gym \n Low-density, quiet, secure \n Suitable for those with car or ride-sharing \n Less crowded than student-focused condos',
    },
    {
      id: 8,
      property_name: 'HP Villa',
      property_type: 'Landed',
      property_size: 'Entire house, large rooms',
      property_price: 'RM700–RM1,200 per room',
      distance_to_help_uni: '8 minutes (drive or shuttle)',
      room_features: 'Large master and deluxe rooms \n Private/shared bath, premium furnishings \n Spacious layout with garden',
      amenities_advantages: 'Unique large house, upscale student experience \n Quiet, exclusive, often fully booked \n Great for final-year or postgraduate students \n Premium privacy and comfort',
    }
  ];

  // Filter based on the query parameters
  if (query.includes('property_name =')) {
    const propertyName = params[0];
    return mockDb.filter(p => p.property_name === propertyName);
  } 
  
  // Basic filtering for search
  let results = [...mockDb];
  
  // Filter by property type if specified
  if (params.some(p => ['Condominium', 'Apartment', 'Shop Lot', 'Landed'].includes(p))) {
    const propertyType = params.find(p => ['Condominium', 'Apartment', 'Shop Lot', 'Landed'].includes(p));
    results = results.filter(p => p.property_type === propertyType);
  }
  
  // Filter by max price if specified
  if (params.some(p => typeof p === 'number')) {
    const maxPrice = params.find(p => typeof p === 'number');
    results = results.filter(p => {
      // Extract minimum price from range like "RM850–RM3,300"
      const minPrice = parseInt(p.property_price.match(/RM(\d+)/)?.[1] || '9999');
      return minPrice <= (maxPrice || 9999);
    });
  }
  
  // Filter by keywords
  const keywords = params.find(p => typeof p === 'string' && !['Condominium', 'Apartment', 'Shop Lot', 'Landed'].includes(p));
  if (keywords) {
    results = results.filter(p => 
      p.room_features.toLowerCase().includes(keywords.toLowerCase()) || 
      p.amenities_advantages.toLowerCase().includes(keywords.toLowerCase())
    );
  }
  
  // Return at most 5 items for the carousel
  return results.slice(0, 5);
}
