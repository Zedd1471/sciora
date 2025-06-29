import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

type Post = { id: string; author_name: string; level: string; department: string; title: string; content: string; media_url?: string; video_url?: string; };

type Comment = { id: string; commenter_name: string; comment: string; created_at: string; };

const COMMENTS_PAGE_SIZE = 5;

export default function KnowledgeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  // Initial post fetch
  useEffect(() => {
    supabase
      .from<Post>('knowledge_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => { if (!error && data) setPosts(data); });
  }, []);

  const openModal = (post: Post) => {
    setSelectedPost(post);
    setCommentPage(1);
    loadComments(post.id, 1);
    supabase
      .from('post_ratings')
      .select('id')
      .eq('post_id', post.id)
      .then(({ data }) => { if (data?.length) setHasVoted(true); });
  };

  const closeModal = () => {
    setSelectedPost(null);
    setComments([]);
    setNewCommentName('');
    setNewCommentText('');
    setHasVoted(false);
  };

  async function loadComments(postId: string, page: number) {
    const { data, error, count } = await supabase
      .from<Comment>('post_comments')
      .select('*', { count: 'exact' })
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
      .range((page - 1) * COMMENTS_PAGE_SIZE, page * COMMENTS_PAGE_SIZE - 1);

    if (!error && data) {
      setComments(page === 1 ? data : [...comments, ...data]);
      setHasMoreComments((page * COMMENTS_PAGE_SIZE) < (count ?? 0));
    }
  }

  const handleRate = () => {
    if (!selectedPost || hasVoted) return;
    supabase
      .from('post_ratings')
      .insert([{ id: uuidv4(), post_id: selectedPost.id, rating: 1 }])
      .then(() => setHasVoted(true));
  };

  const handleCommentPost = () => {
    if (!selectedPost || !newCommentName || !newCommentText) return;
    supabase
      .from('post_comments')
      .insert([{ id: uuidv4(), post_id: selectedPost.id, commenter_name: newCommentName, comment: newCommentText }])
      .then(() => {
        setNewCommentName('');
        setNewCommentText('');
        loadComments(selectedPost.id, 1);
      });
  };

  return (
    <>
      {/* Post grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '2rem', padding: '2rem' }}>
        {posts.map(post => (
          <div key={post.id} onClick={() => openModal(post)} style={ glassCardStyle }>
            <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
            <p style={{ color: '#f1f1f1', fontSize: '.85rem' }}>
              <strong>{post.author_name || 'Anonymous'}</strong> • {post.level} • {post.department}
            </p>
            <p style={{ color: '#e2e8f0', marginTop: '1rem' }}>
              {post.content.length > 120 ? post.content.slice(0,120) + '...' : post.content}
            </p>
            <div style={buttonLabelStyle}>Read More →</div>
          </div>
        ))}
      </div>

      {/* Modal with interactions */}
      {selectedPost && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} style={closeButtonStyle}>✕</button>
            <h2>{selectedPost.title}</h2>
            <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>{selectedPost.author_name}, {selectedPost.level}, {selectedPost.department}</p>
            <p style={{ color: '#f8fafc', lineHeight: 1.6 }}>{selectedPost.content}</p>
            {selectedPost.video_url && <iframe src={selectedPost.video_url} style={mediaStyle} />}
            {selectedPost.media_url && <a href={selectedPost.media_url} target="_blank" rel="noopener noreferrer" style={{ ...mediaStyle, display: 'block' }}>📎 View File</a>}

            <button onClick={handleRate} disabled={hasVoted} style={{ ...interactionButtonStyle, opacity: hasVoted ? 0.5 : 1 }}>
              👍 {hasVoted ? 'Thanks for voting!' : 'Rate this post'}
            </button>

            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Comments</h4>
              <div style={commentsContainerStyle}>
                {comments.length === 0 && <p style={{ color: '#ccc' }}>No comments yet.</p>}
                {comments.map(c => (
                  <div key={c.id} style={commentStyle}>
                    <strong>{c.commenter_name}</strong>
                    <p style={{ margin: 0 }}>{c.comment}</p>
                    <span style={{ fontSize: '.75rem', color: '#aaa' }}>{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              {hasMoreComments && (
                <button onClick={() => loadComments(selectedPost.id, commentPage + 1)} style={loadMoreBtnStyle}>Load more...</button>
              )}
              <input placeholder="Your name" value={newCommentName} onChange={e => setNewCommentName(e.target.value)} style={textInputStyle} />
              <textarea placeholder="Write comment…" rows={3} value={newCommentText} onChange={e => setNewCommentText(e.target.value)} style={textInputStyle} />
              <button onClick={handleCommentPost} style={postBtnStyle}>💬 Post Comment</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// 💎 Styles (glass, modal, buttons)
const glassCardStyle = {
  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
  background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', padding: '1.5rem',
  boxShadow: '0 8px 32px rgba(31,38,135,0.25)', color: '#fff', cursor: 'pointer', transition: 'transform .3s, box-shadow .3s'
};
const buttonLabelStyle = {
  marginTop: '1.2rem', color: '#fff', fontWeight: 'bold', fontSize: '.9rem',
  border: '1px solid rgba(255,255,255,0.4)', padding: '.4rem .8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)'
};
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw',
  background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
};
const modalStyle = {
  backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '20px', boxShadow: '0 8px 32px rgba(31,38,135,0.37)', color: '#fff',
  padding: '2rem', width: '90%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'
};
const closeButtonStyle = {
  position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.2)',
  color: '#fff', border: 'none', fontSize: '1.5rem', borderRadius: '50%', width: '2.5rem', height: '2.5rem', cursor: 'pointer'
};
const mediaStyle = { width: '100%', borderRadius: '12px', marginBottom: '1.5rem', border: 'none' };
const interactionButtonStyle = {
  background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
  padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'
};
const commentsContainerStyle = {
  background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '10px',
  marginBottom: '1rem', maxHeight: '200px', overflowY: 'auto'
};
const commentStyle = {
  marginBottom: '0.8rem', color: '#eee',
  background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px'
};
const loadMoreBtnStyle = {
  background: 'rgba(255,255,255,0.2)', color: '#fff',
  border: 'none', padding: '0.4rem 0.8rem',
  borderRadius: '6px', cursor: 'pointer', marginBottom: '1rem'
};
const textInputStyle = {
  width: '100%', padding: '0.5rem', marginBottom: '0.5rem',
  border: 'none', borderRadius: '6px'
};
const postBtnStyle = {
  backgroundColor: '#2563eb', color: '#fff',
  border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px',
  cursor: 'pointer', fontWeight: 'bold'
};
