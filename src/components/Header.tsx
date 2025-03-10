
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 backdrop-blur-lg ${
        isScrolled ? 'bg-white/80 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Klyra
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-klyra-accent ${
                location.pathname === '/' ? 'text-klyra-accent' : 'text-klyra-secondaryText'
              }`}
            >
              Projects
            </Link>
            <Link 
              to="/project/1" 
              className={`text-sm font-medium transition-colors hover:text-klyra-accent ${
                location.pathname.includes('/project/') ? 'text-klyra-accent' : 'text-klyra-secondaryText'
              }`}
            >
              Demo Project
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center justify-center rounded-md p-2 text-klyra-secondaryText hover:bg-klyra-muted"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-slide-in">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link 
              to="/" 
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                location.pathname === '/' 
                  ? 'bg-klyra-accent/10 text-klyra-accent' 
                  : 'text-klyra-secondaryText hover:bg-klyra-muted'
              }`}
            >
              Projects
            </Link>
            <Link 
              to="/project/1" 
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                location.pathname.includes('/project/') 
                  ? 'bg-klyra-accent/10 text-klyra-accent' 
                  : 'text-klyra-secondaryText hover:bg-klyra-muted'
              }`}
            >
              Demo Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
