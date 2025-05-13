
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
              <div className="space-y-2">
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* Show property carousel if message has properties and more than one */}
                {message.properties && message.properties.length > 1 && (
                  <PropertyCarousel 
                    properties={message.properties}
                    onPropertyClick={(property) => onPropertyClick(property.property_name)}
                  />
                )}
                
                {/* Show property detail if message has exactly one property */}
                {message.properties && message.properties.length === 1 && (
                  <PropertyDetail property={message.properties[0]} />
                )}
              </div>
              
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
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
