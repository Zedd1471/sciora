import KnowledgeFeed from './KnowledgeFeed';

const StyledKnowledgeHub = () => {
  return (
    <section
      style={{
        padding: '4rem 2rem',
        background: `url('https://images.unsplash.com/photo-1642428668784-43cdfca2813e?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'whitesmoke',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'whitesmoke' }}>
        Knowledge Hub
      </h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Curated insights and guides to help you learn smarter and perform better.
      </p>

      {/* Dynamic feed goes here */}
      <KnowledgeFeed />
    </section>
  );
};

export default StyledKnowledgeHub;
