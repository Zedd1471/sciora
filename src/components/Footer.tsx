import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        width: '100%',
        padding: '1rem',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#ccc',
        fontSize: '1rem',
        marginTop: '2rem', // space above footer
      }}
    >
      &copy; 2025 Sciora •{' '}
      <Link to="/privacy-policy" style={{ color: '#4ECDC4', textDecoration: 'none' }}>
        Privacy Policy
      </Link>
    </footer>
  );
};

export default Footer;
