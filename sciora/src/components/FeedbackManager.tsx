import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import styled from 'styled-components';

const ListItem = styled.div`
  background: #ffffff;
  padding: 1.2rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const DeleteButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.5rem;
`;

const FeedbackManager = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('feedback')
      .select('id, name, message, course, submitted_at')
      .order('submitted_at', { ascending: false });

    if (!error) setFeedbacks(data || []);
    setLoading(false);
  };

  const deleteFeedback = async (id: string) => {
    if (!window.confirm("Delete this feedback?")) return;
    const { error } = await supabase.from('feedback').delete().eq('id', id);
    if (error) {
      console.error("Error deleting feedback:", error);
      alert(`Failed to delete feedback: ${error.message}`);
    } else {
      fetchFeedback();
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  if (loading) return <p>Loading feedback...</p>;
  if (feedbacks.length === 0) return <p>No feedback found.</p>;

  return (
    <div>
      {feedbacks.map(fb => (
        <ListItem key={fb.id}>
          <div style={{ maxWidth: '80%' }}>
            <strong>{fb.name || 'Anonymous'}</strong> &nbsp;
            <span style={{ color: '#666' }}>({fb.course || 'N/A'})</span>
            <div style={{ fontSize: '0.85rem', color: '#888' }}>
              {new Date(fb.submitted_at).toLocaleString()}
            </div>
            <p style={{ marginTop: '0.5rem' }}>{fb.message}</p>
          </div>
          <DeleteButton onClick={() => deleteFeedback(fb.id)}>Delete</DeleteButton>
        </ListItem>
      ))}
    </div>
  );
};

export default FeedbackManager;
