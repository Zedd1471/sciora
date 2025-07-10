import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const deletePost = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    setDeletingId(id);
    await supabase.from('blog_posts').delete().eq('id', id);
    setPosts(prev => prev.filter(p => p.id !== id));
    setDeletingId(null);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (posts.length === 0) return <p>No posts found.</p>;

  return (
    <div>
      {posts.map(post => (
        <div
          key={post.id}
          style={{
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: 6,
            marginBottom: '1rem',
            background: '#f9f9f9'
          }}
        >
          <h4>{post.title}</h4>
          <p style={{ color: '#333' }}>
            {post.content?.length > 150 ? post.content.slice(0, 150) + '...' : post.content || '[No content]'}
          </p>
          <small style={{ color: '#666' }}>
            By {post.author_name || "Admin"} | {new Date(post.created_at).toLocaleString()}
          </small>
          <div style={{ marginTop: '0.5rem' }}>
            <button
              onClick={() => deletePost(post.id)}
              disabled={deletingId === post.id}
              style={{
                background: '#ff4d4f',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.9rem',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              {deletingId === post.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogManager;
