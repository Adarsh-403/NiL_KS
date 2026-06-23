import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: 'home' },
    { name: 'Students', path: '/students', icon: 'users' },
    { name: 'Analytics', path: '/analytics', icon: 'chart-bar' }
  ];

  const renderIcon = (icon) => {
    switch(icon) {
      case 'home':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />;
      case 'users':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />;
      case 'chart-bar':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />;
      default: return null;
    }
  };

  return (
    <div className="w-64 h-full glass-panel border-l-0 border-t-0 border-b-0 rounded-l-none rounded-r-2xl flex flex-col pt-6">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 text-brand-primary font-bold text-xl">
          <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v7"></path>
            </svg>
          </div>
          <span className="tracking-tight">KSRTC Admsn</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link key={link.name} to={link.path}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-brand-primary to-brand-light text-white shadow-md' 
                    : 'text-slate-muted hover:bg-white/60 hover:text-brand-dark'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {renderIcon(link.icon)}
                </svg>
                <span className="font-medium">{link.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-brand-primary/10 to-brand-light/5 rounded-2xl p-4 border border-brand-primary/20 text-center">
          <p className="text-xs text-slate-muted mb-2">Logged in as</p>
          <p className="font-semibold text-brand-dark">Nilambur Admin</p>
        </div>
      </div>
    </div>
  );
}
