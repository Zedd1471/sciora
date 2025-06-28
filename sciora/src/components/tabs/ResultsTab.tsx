import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

const ResultsTab: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*, quizzes(title)')
        .order('taken_at', { ascending: false });

      if (error) {
        setError("Failed to load quiz results.");
      } else {
        setResults(data || []);
      }

      setLoading(false);
    };

    fetchResults();
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quiz Results</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : results.length === 0 ? (
        <p>No results available.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={thStyle}>Student ID</th>
                <th style={thStyle}>Quiz Title</th>
                <th style={thStyle}>Score</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Date Taken</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res) => (
                <tr key={res.id}>
                  <td style={tdStyle}>{res.student_id}</td>
                  <td style={tdStyle}>{res.quizzes?.title || "Untitled"}</td>
                  <td style={tdStyle}>{res.score}</td>
                  <td style={tdStyle}>{res.total}</td>
                  <td style={tdStyle}>{new Date(res.taken_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '0.75rem',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderBottom: '1px solid #eee',
};

export default ResultsTab;
