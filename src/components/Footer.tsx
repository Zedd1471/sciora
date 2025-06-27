import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        width: '100%',
        padding: '1.5rem 1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#ccc',
        fontSize: '1rem',
        marginTop: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: '0.5rem' }}>
        &copy; 2025 Sciora
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <Link
          to="/privacy-policy"
          style={{ color: '#4ECDC4', textDecoration: 'none' }}
        >
          Privacy Policy
        </Link>
        <Link
          to="/resources"
          style={{ color: '#4ECDC4', textDecoration: 'none' }}
        >
          Resources
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
