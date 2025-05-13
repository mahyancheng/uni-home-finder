
import React, { useState, useEffect } from 'react';
import { Message } from '@/lib/types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sendMessageToOpenRouter } from '@/services/aiService';
import { getPropertyDetails } from '@/services/propertyService';

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your HELP University accommodation assistant. I can help you find suitable student housing near campus. What type of accommodation are you looking for?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message to state
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send message to AI service
      const { responseMessage } = await sendMessageToOpenRouter([
        ...messages,
        userMessage,
      ]);
      
      // Add AI response to state
      setMessages((prev) => [...prev, responseMessage]);
      
      // Log response message for debugging
      console.log('Response message with properties:', responseMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, there was an error processing your request. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertyClick = async (propertyName: string) => {
    setIsLoading(true);
    
    try {
      // Get detailed property information
      const property = await getPropertyDetails(propertyName);
      
      if (property) {
        // Add user message requesting details
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: `Tell me more about ${propertyName}`,
          timestamp: new Date(),
        };
        
        // Add response with property details
        const assistantMessage: Message = {
          id: Date.now().toString() + '-response',
          role: 'assistant',
          content: `Here are the details for ${propertyName}:`,
          timestamp: new Date(),
          properties: [property],
        };
        
        setMessages((prev) => [...prev, userMessage, assistantMessage]);
      }
    } catch (error) {
      console.error('Error getting property details:', error);
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Sorry, I couldn't retrieve details for ${propertyName}. Please try again.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-full overflow-hidden flex flex-col">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 py-4">
        <CardTitle className="text-white text-center">
          HELP University Accommodation Finder
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <ChatMessages 
            messages={messages} 
            onPropertyClick={handlePropertyClick} 
          />
        </div>
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </CardContent>
    </Card>
  );
};

export default ChatContainer;
