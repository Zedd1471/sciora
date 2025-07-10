import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer style={{ position: 'relative', marginTop: '4rem', backgroundColor: '#111827', color: '#E5E7EB' }}>
      

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
