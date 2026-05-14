import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { HardHat } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-primary-600">
                <HardHat className="h-8 w-8" />
                <span className="font-bold text-xl tracking-tight text-slate-900">
                  Digitec<span className="text-primary-600">Obra</span>
                </span>
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/' 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Obras
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Toaster position="top-right" />
    </div>
  );
};
