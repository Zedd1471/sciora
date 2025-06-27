import React from 'react';

export default function ResourcesPage() {
  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Resources & Insights</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Explore curated academic content, study tips, lab report guides, and more.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
          <h3>🧪 Writing Better Lab Reports</h3>
          <p>Structure, analysis, and clarity tips for scoring top marks.</p>
        </div>
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
          <h3>📚 Metabolic Engineering Basics</h3>
          <p>Understand biosynthetic regulation and catabolite repression.</p>
        </div>
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
          <h3>📝 Quiz Prep Strategy</h3>
          <p>How to study smart for weekly Sciora quizzes and lab exams.</p>
        </div>
      </div>
    </div>
  );
}
