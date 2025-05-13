
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
    const model = 'mistralai/mistral-7b-instruct:free';

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
        You have access to a database of properties. When students ask about accommodation, use the search_relevant_property tool to find options.
        If they want more details about a specific property, use the detailed_property_search tool.
        Be conversational, helpful, and provide relevant information about student housing options.`
      });
    }

    console.log('Sending to OpenRouter:', formattedMessages);

    // Send request to OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.href, // Required for OpenRouter API
      },
      body: JSON.stringify({
        model: model,
        messages: formattedMessages,
        tools: tools,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter response:', data);

    // Process tool calls if present
    let properties = [];
    
    if (data.choices[0].message.tool_calls) {
      properties = await handleToolCalls(data.choices[0].message.tool_calls);
    }

    // Create response message
    const responseMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: data.choices[0].message.content || '',
      timestamp: new Date(),
      properties: properties.length > 0 ? properties : undefined
    };

    return { responseMessage, properties };
  } catch (error) {
    console.error('Error sending message to OpenRouter:', error);
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
    if (toolCall.function.name === 'search_relevant_property') {
      try {
        const args = JSON.parse(toolCall.function.arguments) as PropertySearchParams;
        const properties = await searchProperties(args);
        results.push(...properties);
      } catch (error) {
        console.error('Error in search_relevant_property:', error);
      }
    } else if (toolCall.function.name === 'detailed_property_search') {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        const property = await getPropertyDetails(args.property_name);
        if (property) {
          results.push(property);
        }
      } catch (error) {
        console.error('Error in detailed_property_search:', error);
      }
    }
  }

  return results;
}
