import { Tool, Message, ToolCall, PropertySearchParams } from '@/lib/types';
import { searchProperties, getPropertyDetails } from './propertyService';

// Define tools that the LLM can use
export const tools: Tool[] = [
  {
    type: "function",
    function: {
      name: "search_relevant_property",
      description: "Search for relevant properties based on specific criteria provided by the user. Returns a list of matching properties with their name, type, size, price, and distance to HELP University.",
      parameters: {
        type: "object",
        properties: {
          property_type: {
            type: "string",
            enum: ["Condominium", "Apartment", "Shop Lot", "Landed"],
            description: "The type of property the user is looking for"
          },
          max_price: {
            type: "integer",
            description: "Maximum price the user is willing to pay"
          },
          max_distance_minutes: {
            type: "integer",
            description: "Maximum distance in minutes to HELP University"
          },
          keywords: {
            type: "string",
            description: "Any specific keywords mentioned by the user (e.g., balcony, gym)"
          }
        },
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "detailed_property_search",
      description: "Retrieve detailed information about a specific property, including room features and amenities.",
      parameters: {
        type: "object",
        properties: {
          property_name: {
            type: "string",
            description: "The exact name of the property to retrieve details for"
          }
        },
        required: ["property_name"]
      }
    }
  }
];

// Send message to OpenRouter API
export async function sendMessageToOpenRouter(
  messages: Message[],
): Promise<{ responseMessage: Message; properties?: any[] }> {
  try {
    const apiKey = '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';
    const model = 'qwen3:8b';

    // Format messages for OpenRouter
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add system message with instructions if not present
    if (!messages.some(msg => msg.role === 'system')) {
      formattedMessages.unshift({
        role: 'system',
        content: `You are a helpful assistant that helps students find accommodation near HELP University in Malaysia. 
        You have access to two tools:
        1. search_relevant_property: Use this tool when students ask about finding properties. This tool accepts parameters like property_type, max_price, max_distance_minutes, and keywords.
        2. detailed_property_search: Use this tool when students want to know more about a specific property. This tool requires the exact property_name.

        CRITICAL INSTRUCTIONS:
        1. When asked about listings or properties without specific criteria, ALWAYS return this exact JSON:
           {
             "status": "success",
             "data": {
               "property_type": "Condominium",
               "max_price": 1500,
               "max_distance_minutes": 30,
               "keywords": "student housing"
             }
           }
        2. When asked about a specific property, return this format:
           {
             "status": "success",
             "data": {
               "property_name": "Nadayu 801"
             }
           }
        3. Do not return empty JSON objects.
        4. Do not make up data - only use the tools to get real data.
        
        EXAMPLE CORRECT RESPONSES:
        User: "Show me listings"
        You: {
          "status": "success",
          "data": {
            "property_type": "Condominium",
            "max_price": 1500,
            "max_distance_minutes": 30,
            "keywords": "student housing"
          }
        }

        User: "Tell me about Nadayu 801"
        You: {
          "status": "success",
          "data": {
            "property_name": "Nadayu 801"
          }
        }
        
        Remember: Always include the default parameters when showing listings.`
      });
    }

    console.log('Sending to OpenRouter:', formattedMessages);

    // Send request to Ollama API
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: formattedMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n'),
        stream: false,
        temperature: 0.1, // Lower temperature for more consistent responses
        format: 'json'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama API error:', response.status, errorText);
      throw new Error(`Ollama API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Raw Ollama response:', data);

    // Process tool calls if present
    let properties = [];
    
    // Ollama generate response format
    if (data.response) {
      try {
        // Try to parse the content as JSON to extract tool calls
        const content = data.response;
        console.log('Processing content:', content);
        
        // First try to parse as JSON
        try {
          const jsonResponse = JSON.parse(content);
          console.log('Parsed JSON response:', jsonResponse);
          
          // Check if it's a property search request
          if (jsonResponse.data && (
              jsonResponse.data.property_type ||
              jsonResponse.data.max_price ||
              jsonResponse.data.max_distance_minutes ||
              jsonResponse.data.keywords
          )) {
            console.log('Detected property search parameters:', jsonResponse.data);
            const searchResults = await searchProperties(jsonResponse.data);
            console.log('Search results:', searchResults);
            properties = searchResults; // Directly assign all results
          }
          // Check if it's a property details request
          else if (jsonResponse.data && jsonResponse.data.property_name) {
            console.log('Detected property details request:', jsonResponse.data);
            const propertyDetails = await getPropertyDetails(jsonResponse.data.property_name);
            console.log('Property details:', propertyDetails);
            if (propertyDetails) {
              properties = [propertyDetails]; // Wrap in array for consistency
            }
          }
          // If empty JSON or no valid parameters, use default search parameters
          else {
            console.log('Using default search parameters');
            const defaultParams = {
              property_type: undefined,
              max_distance_minutes: undefined,
              keywords: undefined
            };
            const searchResults = await searchProperties(defaultParams);
            console.log('Default search results:', searchResults);
            properties = searchResults; // Directly assign all results
          }
        } catch (jsonError) {
          console.log('Not a JSON response, using default parameters');
          // If JSON parsing fails, use default parameters
          const defaultParams = {
            property_type: undefined,
            max_distance_minutes: undefined,
            keywords: undefined
          };
          const searchResults = await searchProperties(defaultParams);
          console.log('Default search results:', searchResults);
          properties = searchResults; // Directly assign all results
        }
      } catch (error) {
        console.error('Error processing response:', error);
      }
    } else {
      // If no response at all, use default parameters
      console.log('No response, using default parameters');
      const defaultParams = {
        property_type: undefined,
        max_distance_minutes: undefined,
        keywords: undefined
      };
      const searchResults = await searchProperties(defaultParams);
      console.log('Default search results:', searchResults);
      properties = searchResults; // Directly assign all results
    }

    // Create response message
    let responseContent = 'Here are all available properties:\n\n';
    
    // If we have properties, format them in a conversational way
    if (properties.length > 0) {
      properties.forEach((prop, index) => {
        responseContent += `${index + 1}. ${prop.property_name} (${prop.property_type})\n`;
        responseContent += `   - Price: ${prop.property_price}\n`;
        responseContent += `   - Distance: ${prop.distance_to_help_uni}\n`;
        responseContent += `   - Size: ${prop.property_size}\n`;
        if (prop.amenities_advantages) {
          responseContent += `   - Amenities: ${prop.amenities_advantages.split('\n')[0]}\n`;
        }
        responseContent += '\n';
      });
      responseContent += `\nTotal Properties: ${properties.length}`;
    } else {
      responseContent = 'I apologize, but I could not find any properties matching the criteria. Would you like to try different search parameters?';
    }

    const responseMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      properties: properties // Pass all properties to the frontend
    };

    console.log('Final response message with properties:', responseMessage);
    return { responseMessage, properties };
  } catch (error) {
    console.error('Error in AI service:', error);
    return {
      responseMessage: {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      }
    };
  }
}

// Handle tool calls from the LLM
async function handleToolCalls(toolCalls: ToolCall[]): Promise<any[]> {
  const results = [];

  for (const toolCall of toolCalls) {
    if (toolCall.function && toolCall.function.name === 'search_relevant_property') {
      try {
        const args = JSON.parse(toolCall.function.arguments) as PropertySearchParams;
        console.log('Searching properties with args:', args);
        const properties = await searchProperties(args);
        console.log('Found properties:', properties);
        if (properties.length > 0) {
          results.push(...properties);
        }
      } catch (error) {
        console.error('Error in search_relevant_property:', error);
      }
    } else if (toolCall.function && toolCall.function.name === 'detailed_property_search') {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        console.log('Getting property details for:', args.property_name);
        const property = await getPropertyDetails(args.property_name);
        console.log('Found property details:', property);
        if (property) {
          results.push(property);
        }
      } catch (error) {
        console.error('Error in detailed_property_search:', error);
      }
    }
  }

  console.log('Returning results from handleToolCalls:', results);
  return results;
}
