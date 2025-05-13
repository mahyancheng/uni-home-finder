
import React, { useRef, useEffect } from 'react';
import { Message } from '@/lib/types';
import { Avatar } from '@/components/ui/avatar';
import PropertyCarousel from './PropertyCarousel';
import PropertyDetail from './PropertyDetail';

interface ChatMessagesProps {
  messages: Message[];
  onPropertyClick: (propertyName: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, onPropertyClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  // Find the most recent message that has properties
  const messageWithProperties = [...messages].reverse().find(msg => msg.properties && msg.properties.length > 0);

  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-4 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <div className="flex items-start">
              {message.role !== 'user' && (
                <Avatar className="h-8 w-8 mr-2">
                  <div className="bg-blue-500 h-full w-full flex items-center justify-center text-white text-xs font-bold">
                    AI
                  </div>
                </Avatar>
              )}
              <div className="space-y-2 w-full">
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 ml-2">
                    <div className="bg-gray-500 h-full w-full flex items-center justify-center text-white text-xs font-bold">
                      You
                    </div>
                  </Avatar>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Display properties carousel if any message has properties */}
      {messageWithProperties && messageWithProperties.properties && messageWithProperties.properties.length > 0 && (
        <div className="w-full bg-white rounded-lg shadow p-4 mt-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            {messageWithProperties.properties.length > 1 
              ? "Available Properties" 
              : "Property Details"}
          </h3>
          
          {messageWithProperties.properties.length > 1 ? (
            <PropertyCarousel 
              properties={messageWithProperties.properties}
              onPropertyClick={(property) => onPropertyClick(property.property_name)}
            />
          ) : (
            <PropertyDetail property={messageWithProperties.properties[0]} />
          )}
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
