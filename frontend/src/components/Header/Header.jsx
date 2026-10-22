import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import RepairsMegaMenu from './RepairsMegaMenu';
import AboutUsDropdown from './AboutUsDropdown';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRepairsHovered, setIsRepairsHovered] = useState(false);
  const [isAboutUsHovered, setIsAboutUsHovered] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const { cartCount } = useCart();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { title: 'Repairs & Servicing', href: '/pages/repairs' },
    { title: 'Refurbished Devices', href: '/collections/refurbished' },
    { title: 'About Us', href: '/pages/about-us' },
  ];

  return (
    <header className="SAMZ-header sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-20">

          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 group">
              {/* SAMZ Stylized Diamond X Icon */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-1 transform rotate-45 group-hover:scale-105 transition-transform duration-200">
                  <div className="w-3 h-3 bg-[#FF6534] rounded-xs shadow-xs"></div>
                  <div className="w-3 h-3 bg-[#FF6534] rounded-xs shadow-xs"></div>
                  <div className="w-3 h-3 bg-[#FF6534] rounded-xs shadow-xs"></div>
                  <div className="w-3 h-3 bg-[#FF6534] rounded-xs shadow-xs"></div>
                </div>
              </div>
              <span className="text-3xl font-extrabold tracking-tight text-[#282338]">
                SAMZ
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex flex-1 items-center justify-start ml-8 space-x-1 font-semibold text-[15px]">
            {navLinks.map((link, index) => (
              <React.Fragment key={link.title}>
                {link.title === 'Repairs & Servicing' ? (
                  <div
                    className="py-6 cursor-pointer"
                    onMouseEnter={() => {
                      setIsRepairsHovered(true);
                      setIsAboutUsHovered(false);
                    }}
                    onMouseLeave={() => setIsRepairsHovered(false)}
                  >
                    <a
                      href={link.href}
                      className={`px-3 py-2 transition-colors duration-150 tracking-tight whitespace-nowrap ${isRepairsHovered ? 'text-[#FF6534]' : 'text-[#282338] hover:text-[#FF6534]'
                        }`}
                    >
                      {link.title}
                    </a>
                  </div>
                ) : link.title === 'About Us' ? (
                  <div
                    className="relative py-6 cursor-pointer"
                    onMouseEnter={() => {
                      setIsAboutUsHovered(true);
                      setIsRepairsHovered(false);
                    }}
                    onMouseLeave={() => setIsAboutUsHovered(false)}
                  >
                    <Link
                      to="/pages/about-us"
                      className={`px-3 py-2 transition-colors duration-150 tracking-tight whitespace-nowrap ${isAboutUsHovered ? 'text-[#FF6534]' : 'text-[#282338] hover:text-[#FF6534]'
                        }`}
                    >
                      {link.title}
                    </Link>

                    {/* About Us Dropdown Floating directly under About Us link */}
                    {isAboutUsHovered && (
                      <AboutUsDropdown
                        onMouseEnter={() => setIsAboutUsHovered(true)}
                        onMouseLeave={() => setIsAboutUsHovered(false)}
                        onItemClick={() => setIsAboutUsHovered(false)}
                      />
                    )}
                  </div>
                ) : (
                  <a
                    href={link.href}
                    className="text-[#282338] hover:text-[#FF6534] px-3 py-2 transition-colors duration-150 tracking-tight whitespace-nowrap"
                  >
                    {link.title}
                  </a>
                )}
                {index < navLinks.length - 1 && (
                  <span className="text-[#f2a1b7] font-light select-none px-1">|</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Right Action Icons (Search, Cart, User) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Input Box */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-56 pl-4 pr-9 py-1.5 text-sm rounded-full border border-gray-300 focus:outline-none focus:border-[#FF6534] focus:ring-1 focus:ring-[#FF6534] text-gray-700 placeholder-gray-500 transition-all duration-200 bg-white"
              />
              <button
                type="button"
                className="absolute right-3 text-[#FF6534] hover:scale-110 transition-transform duration-150 cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Shopping Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-[#282338] hover:text-[#FF6534] transition-colors duration-150 flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
              <span className="absolute -top-0.5 -right-0.5 bg-[#FF6534] text-white text-[11px] font-bold rounded-full min-w-[18px] h-4 px-1 flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </Link>

            {/* User Account / Login Button */}
            <div className="relative" ref={userMenuRef}>
              {!isAuthenticated ? (
                <button
                  type="button"
                  id="header-user-btn"
                  onClick={() => openAuthModal('login')}
                  className="p-1.5 text-[#282338] hover:text-[#FF6534] border border-gray-300 rounded-full transition-all duration-150 flex items-center justify-center hover:border-[#FF6534] cursor-pointer"
                  aria-label="User Account Login"
                  title="Sign In / Register"
                >
                  <User className="w-5 h-5 stroke-[1.8]" />
                </button>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    id="header-profile-menu-btn"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full border border-gray-200 hover:border-[#FF6534] transition-colors bg-gray-50 hover:bg-white cursor-pointer"
                    aria-label="User Profile"
                    title={`Logged in as ${user?.name}`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#FF6534] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-[#282338] max-w-[85px] truncate hidden lg:inline">
                      {user?.name?.split(' ')[0] || 'Account'}
                    </span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-[11px] font-medium text-gray-400">Signed in as</p>
                        <p className="text-sm font-bold text-[#1e1b2e] truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1.5">
                        <Link
                          to="/collections/refurbished"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-[#FF6534] transition-colors"
                        >
                          Shop Refurbished Devices
                        </Link>
                        <Link
                          to="/pages/repairs"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-[#FF6534] transition-colors"
                        >
                          Book a Repair
                        </Link>
                        <Link
                          to="/cart"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-[#FF6534] transition-colors"
                        >
                          View Cart ({cartCount})
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          type="button"
                          id="header-logout-btn"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            <Link
              to="/cart"
              className="relative p-1.5 text-[#282338]"
              aria-label="Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-[#FF6534] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#282338] hover:text-[#FF6534] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Repairs & Servicing Dropdown Floating Centered */}
        {isRepairsHovered && (
          <RepairsMegaMenu
            onMouseEnter={() => setIsRepairsHovered(true)}
            onMouseLeave={() => setIsRepairsHovered(false)}
          />
        )}

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:border-[#FF6534]"
            />
            <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-[#FF6534]" />
          </div>
          <nav className="flex flex-col space-y-2 font-semibold">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.title}
                  to={link.href}
                  className="text-[#282338] hover:text-[#FF6534] py-2 border-b border-gray-50 text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ) : (
                <a
                  key={link.title}
                  href={link.href}
                  className="text-[#282338] hover:text-[#FF6534] py-2 border-b border-gray-50 text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.title}
                </a>
              )
            ))}
          </nav>
          <div className="pt-3 border-t border-gray-100">
            {!isAuthenticated ? (
              <button
                type="button"
                id="mobile-auth-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="flex items-center gap-2.5 text-[#282338] font-semibold text-sm hover:text-[#FF6534] w-full py-2 cursor-pointer"
              >
                <div className="p-1.5 border border-gray-300 rounded-full">
                  <User className="w-4 h-4" />
                </div>
                Sign In / Register
              </button>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FF6534] text-white flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-[#1e1b2e] leading-tight">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer ml-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

