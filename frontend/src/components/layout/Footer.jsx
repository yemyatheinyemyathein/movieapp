import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-dark-600 bg-dark-800 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <span className="font-display text-2xl tracking-widest gradient-text">CINEVAULT</span>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            Your personal movie universe. Discover, explore, and save your favorite films.
          </p>
        </div>
        {/* Links */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Navigation</h4>
          <ul className="space-y-2">
            {[['/', 'Home'], ['/movies', 'Browse Movies'], ['/favorites', 'Favorites']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-gray-400 hover:text-white text-sm transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Info */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3">About</h4>
          <p className="text-gray-500 text-sm">
            Built with React, Node.js, Express &amp; MongoDB.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Movie data © respective studios
          </p>
        </div>
      </div>
      <div className="border-t border-dark-600 mt-8 pt-6 text-center text-gray-600 text-xs">
        © {new Date().getFullYear()} CineVault. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;