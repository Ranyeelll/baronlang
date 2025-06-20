import React from 'react';
import { Header } from './Header';
import Chatbot from './Chatbot';

export const Layout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <div className="min-h-screen bg-gray-50">
    <Header />
    <main className="p-4">
      <div className="max-w-6xl mx-auto space-y-6">{children}</div>
    </main>
    <Chatbot />
  </div>;
};