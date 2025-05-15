import React from 'react';
import { Menu, X } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Payments from './pages/Payments';
import Alerts from './pages/Alerts';
import Notes from './pages/Notes';
import Members from './pages/Members';
import './App.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-primary text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold">BeşYatırım</span>
                </div>
              </div>
              <div className="hidden md:flex md:items-center md:space-x-4">
                <NavLink to="/" className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition duration-150 ${isActive ? 'bg-primary-dark' : ''}`
                }>
                  Dashboard
                </NavLink>
                <NavLink to="/portfolio" className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition duration-150 ${isActive ? 'bg-primary-dark' : ''}`
                }>
                  Portfolio
                </NavLink>
                <NavLink to="/members" className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition duration-150 ${isActive ? 'bg-primary-dark' : ''}`
                }>
                  Members
                </NavLink>
                <NavLink to="/payments" className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition duration-150 ${isActive ? 'bg-primary-dark' : ''}`
                }>
                  Payments
                </NavLink>
                <NavLink to="/alerts" className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition duration-150 ${isActive ? 'bg-primary-dark' : ''}`
                }>
                  Alerts
                </NavLink>
                <NavLink to="/notes" className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition duration-150 ${isActive ? 'bg-primary-dark' : ''}`
                }>
                  Notes
                </NavLink>
              </div>
              <div className="md:hidden flex items-center">
                <button 
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary-dark text-white' : 'text-white hover:bg-primary-dark'}`
                }
                onClick={closeMobileMenu}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/portfolio" 
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary-dark text-white' : 'text-white hover:bg-primary-dark'}`
                }
                onClick={closeMobileMenu}
              >
                Portfolio
              </NavLink>
              <NavLink 
                to="/members" 
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary-dark text-white' : 'text-white hover:bg-primary-dark'}`
                }
                onClick={closeMobileMenu}
              >
                Members
              </NavLink>
              <NavLink 
                to="/payments" 
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary-dark text-white' : 'text-white hover:bg-primary-dark'}`
                }
                onClick={closeMobileMenu}
              >
                Payments
              </NavLink>
              <NavLink 
                to="/alerts" 
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary-dark text-white' : 'text-white hover:bg-primary-dark'}`
                }
                onClick={closeMobileMenu}
              >
                Alerts
              </NavLink>
              <NavLink 
                to="/notes" 
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary-dark text-white' : 'text-white hover:bg-primary-dark'}`
                }
                onClick={closeMobileMenu}
              >
                Notes
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/members" element={<Members />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/notes" element={<Notes />} />
          </Routes>
        </main>

        <footer className="bg-primary text-white py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-center">© {new Date().getFullYear()} BeşYatırım Investment Group</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;