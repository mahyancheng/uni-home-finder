
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
      {messages.map((message, index) => (
        <React.Fragment key={message.id}>
          <div
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

          {/* Display properties carousel immediately after an assistant message if it has properties */}
          {message.role === 'assistant' && message.properties && message.properties.length > 0 && (
            <div className="w-full bg-white rounded-lg shadow p-4 mt-2">
              {message.properties.length > 1 ? (
                <PropertyCarousel 
                  properties={message.properties}
                  onPropertyClick={(property) => onPropertyClick(property.property_name)}
                />
              ) : (
                <PropertyDetail property={message.properties[0]} />
              )}
            </div>
          )}
        </React.Fragment>
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
