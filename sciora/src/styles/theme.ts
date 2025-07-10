
export const theme = {
  colors: {
    primary: '#4ECDC4',
    secondary: '#FF6B6B',
    background: '#FFFFFF',
    text: '#2d3e50',
    textLight: '#718096',
    glassBg: 'rgba(255, 255, 255, 0.15)',
    glassBorder: 'rgba(255, 255, 255, 0.3)',
  },
  fonts: {
    main: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  fontSizes: {
    small: '0.9rem',
    medium: '1.2rem',
    large: '2.5rem',
    xlarge: 'clamp(2rem, 8vw, 6rem)',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
  },
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
};

export type ThemeType = typeof theme;
