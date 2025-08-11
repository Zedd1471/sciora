import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  padding: 1rem 2rem;
  background: rgba(26, 26, 26, 0.8); /* Semi-transparent dark background */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffffff; /* White text for contrast */
  letter-spacing: 1px;
`;

const LogoIcon = styled.img`
  height: 40px;
  width: 40px;
  margin-right: 0.75rem;
`;

const Header: React.FC = () => (
  <HeaderContainer>
    <LogoLink to="/">
      <LogoIcon src="/Sc-favicon.png" alt="Sciora Favicon" />
      Sciora
    </LogoLink>
  </HeaderContainer>
);

export default Header;



