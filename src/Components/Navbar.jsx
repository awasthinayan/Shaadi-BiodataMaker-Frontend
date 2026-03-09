import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // ✅ LAZY INITIALIZER - reads localStorage during state init
  const [auth, setAuth] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      let parsedUser = { name: 'User', email: '' };
      
      if (userData && userData !== 'undefined' && userData !== 'null' && userData.length > 2) {
        try {
          const parsed = JSON.parse(userData);
          // ✅ Make sure user has a name property
          parsedUser = {
            name: parsed?.name || parsed?.fullName || 'User',
            email: parsed?.email || ''
          };
        } catch (e) {
          console.error('Error parsing user JSON:', e);
          parsedUser = { name: 'User', email: '' };
        }
      }
      
      return {
        isLoggedIn: !!token,
        user: parsedUser
      };
    } catch (error) {
      console.error('Error reading auth data:', error);
      return {
        isLoggedIn: false,
        user: { name: 'User', email: '' }
      };
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      isLoggedIn: false,
      user: { name: 'User', email: '' }
    });
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Don't show navbar on auth pages
  const hideOn = ['/', '/login', '/register'];
  if (hideOn.includes(location.pathname)) return null;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/create', label: 'New Biodata', icon: '➕' },
  ];

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-white border-b border-stone-100 shadow-sm print:hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <motion.span
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className="text-2xl"
            >
              💍
            </motion.span>
            <span className="font-bold text-lg text-stone-800 tracking-tight group-hover:text-rose-800 transition-colors">
              ShaadiBio
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden sm:flex items-center gap-1">
            {auth.isLoggedIn && navLinks.map(({ path, label, icon }) => (
              <Link key={path} to={path}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                    isActive(path)
                      ? 'bg-rose-50 text-rose-800'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                  {isActive(path) && (
                    <motion.span
                      layoutId="activeNavDot"
                      className="w-1.5 h-1.5 rounded-full bg-rose-700 ml-0.5"
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {auth.isLoggedIn ? (
              <>
                {/* User pill */}
                <div className="hidden sm:flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-full px-3 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-rose-800 flex items-center justify-center text-white text-xs font-bold">
                    {(auth.user?.name || 'U')[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-stone-700 max-w-24 truncate">
                    {auth.user?.name || auth.user?.email || 'User'}
                  </span>
                </div>

                {/* Logout button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-stone-200"
                >
                  <span>🚪</span>
                  Logout
                </motion.button>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="sm:hidden p-2 rounded-xl text-stone-500 hover:bg-stone-100 transition-colors"
                >
                  <div className="w-5 flex flex-col gap-1">
                    <motion.span
                      animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
                      className="block h-0.5 w-full bg-stone-600 rounded-full origin-center"
                    />
                    <motion.span
                      animate={{ opacity: menuOpen ? 0 : 1 }}
                      className="block h-0.5 w-full bg-stone-600 rounded-full"
                    />
                    <motion.span
                      animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
                      className="block h-0.5 w-full bg-stone-600 rounded-full origin-center"
                    />
                  </div>
                </button>
              </>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 text-sm font-semibold bg-rose-800 hover:bg-rose-900 text-white rounded-xl transition-colors shadow-sm"
                >
                  Login
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Dropdown Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden print:hidden"
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-stone-200 shadow-lg sm:hidden print:hidden"
            >
              {/* User info row */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100">
                <div className="w-9 h-9 rounded-full bg-rose-800 flex items-center justify-center text-white font-bold">
                  {(auth.user?.name || 'U')[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">{auth.user?.name || 'User'}</p>
                  <p className="text-xs text-stone-400">{auth.user?.email || ''}</p>
                </div>
              </div>

              {/* Nav links */}
              <div className="py-2">
                {navLinks.map(({ path, label, icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive(path)
                        ? 'bg-rose-50 text-rose-800'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{icon}</span>
                    {label}
                    {isActive(path) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-700" />}
                  </Link>
                ))}
              </div>

              {/* Logout */}
              <div className="px-4 py-3 border-t border-stone-100">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 py-2.5 px-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}