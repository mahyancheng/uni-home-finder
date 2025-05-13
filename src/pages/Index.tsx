
import React from 'react';
import ChatContainer from '@/components/ChatContainer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Student Accommodation Finder</h1>
          <p className="text-gray-600 text-center mt-2">
            Find the perfect accommodation near HELP University with our AI-powered assistant
          </p>
        </header>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[70vh]">
          <ChatContainer />
        </div>
        
        <footer className="mt-6 text-center text-gray-500 text-sm">
          <p>Built with React, OpenRouter API and PostgreSQL</p>
          <p className="mt-1">© 2025 Student Accommodation Finder Demo</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
