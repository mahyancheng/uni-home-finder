
// Type definitions for the application

// Property types
export interface Property {
  id: number;
  property_name: string;
  property_type: string;
  property_size: string;
  property_price: string;
  distance_to_help_uni: string;
  room_features: string;
  amenities_advantages: string;
}

export type PropertySearchParams = {
  property_type?: string;
  max_price?: number;
  max_distance_minutes?: number;
  keywords?: string;
};

// Message types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  properties?: Property[];
}

// Tool definitions
export interface Tool {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}

export interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}
