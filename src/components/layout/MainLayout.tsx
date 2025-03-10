
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-klyra-background">
      <Header />
      <main 
        className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in"
        key={location.pathname}
      >
        {children}
      </main>
      <footer className="py-6 border-t border-klyra-border">
        <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-klyra-secondaryText">
          <p>&copy; {new Date().getFullYear()} Klyra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
