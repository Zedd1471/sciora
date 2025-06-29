// components/PostInteractions.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  postId: string;
}

const PostInteractions = ({ postId }: Props) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (!error && data) setComments(data);
  };

  const handleCommentSubmit = async () => {
    if (!name || !newComment) return;

    await supabase.from('comments').insert([
      {
        id: uuidv4(),
        post_id: postId,
        name,
        content: newComment,
      },
    ]);

    setNewComment('');
    setName('');
    fetchComments();
  };

  const handleRating = async (score: number) => {
    setRating(score);
    await supabase.from('ratings').insert([
      {
        id: uuidv4(),
        post_id: postId,
        score,
      },
    ]);
  };

  return (
    <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1rem' }}>
      <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Rate this post:</h4>
      <div style={{ marginBottom: '1rem' }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => handleRating(num)}
            style={{
              marginRight: '0.3rem',
              padding: '0.3rem 0.6rem',
              backgroundColor: rating === num ? '#4ECDC4' : '#ddd',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {num}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '0.5rem', width: '100%', marginBottom: '0.5rem' }}
        />
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ padding: '0.5rem', width: '100%', height: '80px' }}
        />
        <button onClick={handleCommentSubmit} style={{ marginTop: '0.5rem', backgroundColor: '#1A535C', color: '#fff', padding: '0.5rem 1rem', border: 'none' }}>
          Submit
        </button>
      </div>

      <div>
        <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Comments:</h4>
        {comments.length === 0 && <p style={{ color: '#ccc' }}>No comments yet.</p>}
        {comments.map((comment) => (
          <div key={comment.id} style={{ marginBottom: '0.8rem', color: '#eee', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px' }}>
            <strong>{comment.name}</strong>
            <p style={{ margin: 0 }}>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostInteractions;
