'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useLogoutMutation } from '../store/api/authApi';
import toast from 'react-hot-toast';
import { logoutUser } from '../store/slices/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  useEffect(() => { setMounted(true); }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/google-review-qr-code-generator', label: 'Generate QR' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const data = await logout().unwrap();
      if (data.success) {
        dispatch(logoutUser());
        setIsProfileOpen(false);
        setIsOpen(false);
      }
    } catch (err) {
      console.error('Logout failed:', err);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const userInitials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      {/* Animated border keyframes */}


      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
                <img src="/favicon.svg" alt="Logo" className="w-9 h-9" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Review<span className="text-primary">QR</span>
              </span>
            </Link>

            {/* Desktop — Pill Nav centered */}
            <div className="hidden md:flex items-center justify-center flex-1 px-8">
              <div className="relative nav-pill-border">
                <div className="relative bg-white border border-gray-100 rounded-full px-1.5 py-1.5 flex items-center gap-0.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive(link.path)
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-gray-800 hover:text-primary hover:bg-primary/5'
                        }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <Link
                href="/google-review-qr-code-generator"
                className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
              >
                Get Free QR
              </Link>

              {mounted && isAuthenticated && user ? (
                <div className="relative" ref={profileRef}>
                  {/* Avatar with animated ring */}
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="relative avatar-spin-ring avatar-pulse-ring flex items-center gap-2 group"
                    aria-label="Open profile menu"
                  >
                    <div className="relative w-9 h-9 rounded-full overflow-hidden z-10 ring-2 ring-white">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                          {userInitials}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-[calc(100%+12px)] w-60 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 overflow-hidden z-50"
                      style={{ animation: 'fadeIn 0.15s ease' }}>
                      <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20 flex-shrink-0">
                          {user.picture ? (
                            <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                              {userInitials}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                        </div>
                      </div>
                      <div className="py-1.5">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                            <User className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">My Account</p>
                            <p className="text-xs text-gray-400">Dashboard & settings</p>
                          </div>
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                            <LogOut className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-500" />
                          </div>
                          <span className="font-medium">Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : mounted ? (
                <Link
                  href="/auth/login"
                  className="px-5 py-2 border-2 border-primary text-primary text-sm font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-200 active:scale-95"
                >
                  Login
                </Link>
              ) : null}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.path)
                      ? 'text-primary bg-primary/10 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/google-review-qr-code-generator"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 px-4 py-3 bg-primary text-white text-sm font-semibold rounded-xl text-center hover:bg-primary-dark transition-all"
                >
                  Get Free QR Code
                </Link>

                {mounted && isAuthenticated && user ? (
                  <div className="mt-2 border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-3 px-4 py-2 mb-1">
                      <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/25 flex-shrink-0">
                        {user.picture ? (
                          <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                            {userInitials}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                ) : mounted ? (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="mt-1 px-4 py-3 border-2 border-primary text-primary text-sm font-semibold rounded-xl text-center hover:bg-primary hover:text-white transition-all"
                  >
                    Login
                  </Link>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;