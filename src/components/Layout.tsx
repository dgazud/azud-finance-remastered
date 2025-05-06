
import React, { ReactNode } from 'react';
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-light py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <header className="p-5 border-b border-gray-100 bg-gradient-to-r from-primary to-primary/90">
            <div className="flex justify-center items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-white rounded-md flex items-center justify-center shadow-md overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop" 
                    alt="AZUD Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-white font-bold text-2xl">Calculadoras de Financiación</span>
              </Link>
            </div>
          </header>
          
          <main className="p-6 bg-light/30">
            {children}
          </main>
          
          <footer className="bg-primary/5 p-5 text-center">
            <p className="text-muted text-sm">© {new Date().getFullYear()} AZUD. Todos los derechos reservados.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
