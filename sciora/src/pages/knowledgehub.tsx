import React from 'react';
import KnowledgeFeed from '../components/KnowledgeFeed';
import KnowledgePostForm from '../components/KnowledgePostForm'; // make sure this is imported

const KnowledgeHubPage: React.FC = () => {
  return (
    <main
      style={{
        padding: '4rem 2rem',
        background: `url('https://images.unsplash.com/photo-1642428668784-43cdfca2813e?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0')no-repeat center center fixed`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'whitesmoke',
        textAlign: 'center',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Knowledge Hub</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Curated insights and guides to help you learn smarter and perform better.
      </p>

      {/* POSTS DISPLAYED FIRST */}
      <div style={{ marginBottom: '4rem' }}>
        <KnowledgeFeed />
      </div>

      {/* FORM COMES BELOW */}
      <div style={{ marginTop: '4rem' }}>
        <KnowledgePostForm />
      </div>
    </main>
  );
};

export default KnowledgeHubPage;
