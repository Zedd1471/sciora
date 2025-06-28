import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer style={{ position: 'relative', marginTop: '4rem', backgroundColor: '#111827', color: '#E5E7EB' }}>
      {/* Top SVG Wave */}
      <div style={{ position: 'absolute', top: '-80px', left: 0, width: '100%', overflow: 'hidden', lineHeight: 0 }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ height: '80px', width: '100%' }}>
          <path
            d="M0,0V46.29c47.74,22.52,103.8,29.29,158.28,17.19
            c70.07-16.17,136.86-42.71,207-39.75
            c60.29,2.61,113.12,26.07,172.2,33.37
            c63.15,7.78,130.21-3.66,186.49-26.33
            c58-23.32,112.07-53.07,173.55-57.41
            c59.76-4.21,113.77,21.52,168.48,41.13V0Z"
            fill="#111827"
          />
        </svg>
      </div>

      {/* Footer Content */}
      <div style={{ padding: '3rem 1rem 2rem', textAlign: 'center', zIndex: 1, position: 'relative' }}>
        &copy; 2025 Sciora •{' '}
        <Link to="/privacy-policy" style={{ color: '#4ECDC4', textDecoration: 'none' }}>
          Privacy Policy
        </Link>{' '}
        •{' '}
        <Link to="/resources" style={{ color: '#4ECDC4', textDecoration: 'none' }}>
          Resources
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
