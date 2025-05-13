
import React from 'react';
import ChatContainer from '@/components/ChatContainer';
import { Building2, Bed, MapPin } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-4 md:p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center flex items-center justify-center">
            <Building2 className="h-8 w-8 mr-2 text-blue-600" />
            Student Accommodation Finder
          </h1>
          <p className="text-gray-600 text-center mt-2 flex items-center justify-center text-sm md:text-base">
            <MapPin className="h-4 w-4 mr-1 text-blue-500" /> Find the perfect accommodation near HELP University with our AI-powered assistant
          </p>
        </header>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[70vh]">
          <ChatContainer />
        </div>
        
        <footer className="mt-6 text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center mb-2">
            <Bed className="h-4 w-4 mr-1 text-blue-500" />
            <span>Helping students find their ideal accommodation since 2025</span>
          </div>
          <p>Built with React, OpenRouter API and PostgreSQL</p>
          <p className="mt-1">© 2025 Student Accommodation Finder Demo</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
