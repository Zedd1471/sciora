import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

interface Quiz {
  id: string;
  title: string;
  created_at: string;
}

const QuizzesTab: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setQuizzes(data);
    if (error) console.error('Fetch error:', error);
  };

  const handleAddQuiz = async () => {
    if (!title.trim()) return;

    setLoading(true);
    setMessage('');

    // Check if quiz already exists
    const { data: existing } = await supabase
      .from('quizzes')
      .select('*')
      .eq('title', title.trim());

    if (existing && existing.length > 0) {
      setMessage('Quiz with this title already exists.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('quizzes').insert({ title });

    if (error) {
      setMessage('Failed to create quiz.');
    } else {
      setMessage('Quiz added.');
      setTitle('');
      fetchQuizzes();
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quizzes</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter Quiz Title (e.g. Week 2)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #ccc',
            flex: 1,
          }}
        />
        <button onClick={handleAddQuiz} disabled={loading}>
          {loading ? 'Adding...' : 'Add Quiz'}
        </button>
      </div>

      {message && <p>{message}</p>}

      <ul style={{ marginTop: '1rem' }}>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <strong>{quiz.title}</strong> – added {new Date(quiz.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizzesTab;
