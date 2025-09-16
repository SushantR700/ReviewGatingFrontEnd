import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
    setShowMobileSearch(false);
  };

  const handleLogin = (role = 'customer') => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
    window.location.href = `${baseUrl}/login/oauth2/authorization/google?role=${role}`;
    setShowLoginDropdown(false);
    setShowMobileMenu(false);
  };

  const getRoleDisplay = () => {
    if (!user) return '';
    
    if (isAdmin) {
      return 'Business Owner';
    }
    return user.role === 'CUSTOMER' ? 'Customer' : user.role;
  };

  const closeMobileMenus = () => {
    setShowMobileMenu(false);
    setShowMobileSearch(false);
    setShowLoginDropdown(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0" onClick={closeMobileMenus}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-xl text-gray-800 hidden sm:block">ReviewGate</span>
            <span className="font-bold text-lg text-gray-800 sm:hidden">RG</span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search businesses..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-gray-700 font-medium">Hi, {user.name}</div>
                  <div className="text-xs text-gray-500">{getRoleDisplay()}</div>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Business Portal
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-800 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <span>Login</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showLoginDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <button
                      onClick={() => handleLogin('customer')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Login as Customer
                    </button>
                    <button
                      onClick={() => handleLogin('admin')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Login as Business Owner
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setShowMobileSearch(!showMobileSearch);
                setShowMobileMenu(false);
              }}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setShowMobileMenu(!showMobileMenu);
                setShowMobileSearch(false);
              }}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search businesses..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 pt-4 pb-4 space-y-3">
              {user ? (
                <>
                  <div className="border-b pb-3">
                    <div className="text-gray-700 font-medium">Hi, {user.name}</div>
                    <div className="text-sm text-gray-500">{getRoleDisplay()}</div>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenus}
                      className="block bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                    >
                      Business Portal
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenus();
                    }}
                    className="block w-full text-left text-gray-600 hover:text-gray-800 transition-colors px-4 py-3 rounded-lg hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => handleLogin('customer')}
                    className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Login as Customer
                  </button>
                  <button
                    onClick={() => handleLogin('admin')}
                    className="block w-full border border-blue-600 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    Login as Business Owner
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop to close dropdowns */}
      {(showLoginDropdown || showMobileMenu || showMobileSearch) && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          onClick={closeMobileMenus}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;