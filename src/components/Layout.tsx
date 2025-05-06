
import React, { ReactNode } from 'react';
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <header className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-auto bg-primary p-1 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AZUD</span>
                </div>
                <span className="text-primary font-bold text-xl">Calculadoras de Financiación</span>
              </Link>
              <nav>
                <Link 
                  to="/" 
                  className="text-primary hover:text-secondary transition-colors font-medium"
                >
                  Inicio
                </Link>
              </nav>
            </div>
          </header>
          
          <main className="p-6">
            {children}
          </main>
          
          <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} AZUD. Todos los derechos reservados.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};
