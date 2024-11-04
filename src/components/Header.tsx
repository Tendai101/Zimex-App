import React from 'react';
import { ShoppingCart, Search, Store, LogOut } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  cartItemsCount: number;
  onCartClick: () => void;
  onSellerDashboardClick: () => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export function Header({
  searchTerm,
  onSearchChange,
  cartItemsCount,
  onCartClick,
  onSellerDashboardClick,
  currentUser,
  onLoginClick,
  onLogout,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">Zimex</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            
            {currentUser ? (
              <div className="flex items-center gap-4">
                {currentUser.isSeller && (
                  <button
                    onClick={onSellerDashboardClick}
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
                  >
                    <Store size={20} />
                    <span>Seller Dashboard</span>
                  </button>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">{currentUser.name}</span>
                  <button
                    onClick={onLogout}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Login / Register
              </button>
            )}
            
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}