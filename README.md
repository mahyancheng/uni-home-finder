# University Accommodation Assistant

A web application that helps students find suitable accommodation near University. The application uses AI to understand student requirements and provides personalized property recommendations.

## Features

- 🤖 AI-powered conversation interface for natural interaction
- 🏠 Comprehensive property listings with detailed information
- 🔍 Advanced search capabilities (property type, distance, price range)
- 📱 Responsive design for all devices
- 🔒 Secure database storage with PostgreSQL

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm (comes with Node.js)

## Complete Setup Guide

### 1. Database Setup

First, create and set up the PostgreSQL database:

1. Open your terminal and connect to PostgreSQL:
```bash
psql -U postgres
```

2. Create the database:
```sql
CREATE DATABASE student_housing;
```

3. Connect to the new database:
```sql
\c student_housing
```

4. Create the properties table and insert sample data:
```sql
-- Drop existing table if it exists
DROP TABLE IF EXISTS properties;

-- Create properties table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    property_name VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    property_size VARCHAR(50) NOT NULL,
    property_price VARCHAR(50) NOT NULL,
    distance_to_help_uni VARCHAR(255) NOT NULL,
    room_features TEXT NOT NULL,
    amenities_advantages TEXT NOT NULL
);

-- Insert sample property data
INSERT INTO properties (property_name, property_type, property_size, property_price, distance_to_help_uni, room_features, amenities_advantages) VALUES
('Nadayu 801', 'Condominium', '120–1,151 sqft', 'RM850–RM3,300', '10 minutes (via public transport)', 'Single Room (150–300 sqft, RM850–1,000): Fully furnished, shared bathroom, ideal for individual students \n Master Room (220–240 sqft, RM900–1,000): Fully furnished, private bathroom, balcony \n 3-Bedroom Unit (1,033–1,151 sqft, RM1,800–2,700): 3 bedrooms, 4 bathrooms, includes 2 car parks \n 4-Bedroom Unit (~1,079 sqft, RM2,300–3,300): 4 bedrooms, 4 bathrooms, includes 2 car parks', '24-hour security, CCTV, access card \n Swimming pool, badminton court, gym, sky lounge, BBQ area, playground \n High ceilings, large windows, ensuite bathrooms \n Free washing machine & dryer \n Near food outlets (Zus Coffee, Village Grocer, 99 Speedmart, etc.) \n Private lobbies, shuttle bus to HELP'),
('DK Impian', 'Apartment', 'Varies (Studios, Shared Rooms)', 'RM900–RM1,100', '10 minutes (public transport; traffic may reach 1 hour)', 'Shared Room: RM900 (partially furnished) \n Studio: RM1,100 (fully furnished), private bathroom', 'Infinity pool, gym, sky lounge, BBQ area, reflexology path \n Children''s playground, 24-hour security, access card entry \n Air conditioning, new building, modern design \n Shuttle available, near MRT and DASH'),
('Shop Lot Hostel', 'Shop Lot', '80–360 sqft', 'RM480–RM1,200', '3 minutes (walking distance)', 'Low Cost Room (80–120 sqft, RM480–600): Shared bathroom, some without windows \n Premium Room (80–120 sqft, RM1,000–1,200): Private bathroom, with balcony and windows \n 2-Bedroom Unit (240–360 sqft, RM700/pax): Fully furnished, private/shared options', 'Extremely close to HELP \n Surrounded by food and marts (Mixue, 7-11, CU Mart, etc.) \n High safety: bomba certified, insured, anti-fire door \n Affordable pricing, fully furnished, shared/common area \n Cost-effective option for students'),
('Subang Residences (Landed)', 'Landed', 'Varies (Multiple rooms in house)', 'RM500–RM700 per room', '8 minutes (shuttle provided)', 'Single/shared rooms in 3-storey terrace homes \n Some en-suite bathrooms, others shared', 'Gated & guarded community \n Shuttle to campus, spacious living \n Feels like home with living & dining space \n Close-knit student environment'),
('Damai Apartment', 'Apartment', '3–4 Bedroom Units', 'RM400–RM600 per room', '3 minutes (walking distance)', 'Small Room: RM400+, shared bathroom \n Medium/Large Room: RM500–600, some en-suite \n Basic furnishing, WiFi often included', 'Affordable, close to campus \n Guarded entrance, small pool, common area \n Shops and eateries within walking distance \n Great for budget-conscious students'),
('Atria Residence', 'Apartment', 'Varies (Limited units)', 'RM450–RM700 per room', '5–7 minutes (shuttle available)', 'Rooms in low-rise apartment blocks \n Furnished, some with attached bath \n Quiet environment, less crowded', 'Low-density, quiet student area \n Secure, gated compound \n Close to shops, shuttle to campus \n Ideal for privacy-seeking students'),
('Embayu @ Damansara West', 'Condominium', '3-Bedroom Units (~1,000+ sqft)', 'RM700–RM1,100 per room', '5–10 minutes (drive or shuttle)', 'Master Room: ~RM1,100 with bath \n Middle Room: RM850+ \n Single Room: RM700+', 'New condo with pool, gym \n Low-density, quiet, secure \n Suitable for those with car or ride-sharing \n Less crowded than student-focused condos'),
('HP Villa', 'Landed', 'Entire house, large rooms', 'RM700–RM1,200 per room', '8 minutes (drive or shuttle)', 'Large master and deluxe rooms \n Private/shared bath, premium furnishings \n Spacious layout with garden', 'Unique large house, upscale student experience \n Quiet, exclusive, often fully booked \n Great for final-year or postgraduate students \n Premium privacy and comfort');
```

### 2. Application Setup

1. Clone the repository:
```bash
git clone https://github.com/mahyancheng/uni-home-finder.git
cd uni-home-finder
```

2. Install dependencies:
```bash
npm install
```

### 3. Running the Application

The application consists of two parts: a backend server and a frontend development server.

1. Start the backend server (in one terminal):
```bash
node server.js
```
The backend server will run on http://localhost:3000

2. Start the frontend development server (in another terminal):
```bash
npm run dev
```
The frontend will be available at http://localhost:8081 (or another port if 8081 is in use)

## Using the Application

1. Open your web browser and navigate to http://localhost:8081
2. You'll see the chat interface where you can interact with the AI assistant
3. Try asking questions like:
   - "Show me available listings"
   - "What properties are within 10 minutes of HELP University?"
   - "I'm looking for a condominium under RM1000"
   - "Tell me more about Nadayu 801"

The AI assistant will understand your requirements and show you relevant properties from the database.

## Project Structure

```
uni-home-finder/
├── src/
│   ├── components/     # React components
│   ├── services/       # API and service functions
│   ├── types/         # TypeScript type definitions
│   └── lib/           # Utility functions and configurations
├── server.js          # Backend Express server
├── setup_database.sql # Database setup script
└── package.json       # Project dependencies and scripts
```

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/properties` - Search properties with optional filters:
  - `property_type` - Filter by property type
  - `max_distance_minutes` - Filter by maximum distance
  - `keywords` - Search across all property fields

- `GET /api/properties/:name` - Get detailed information about a specific property

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui

- Backend:
  - Node.js
  - Express
  - PostgreSQL
  - pg (PostgreSQL client)

## Support

For support, please open an issue in the GitHub repository or contact the development team.
