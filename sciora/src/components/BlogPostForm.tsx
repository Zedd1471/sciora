import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const BlogPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    const { error: insertError } = await supabase.from('blog_posts').insert([
      {
        title,
        content,
        video_url: videoUrl || null,
        tags: tags.split(',').map(tag => tag.trim()),
      },
    ]);

    if (insertError) {
      alert('Error submitting post');
      console.error(insertError);
    } else {
      alert('Post submitted!');
      setTitle('');
      setContent('');
      setVideoUrl('');
      setTags('');
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(46, 31, 31, 0.48)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '16px',
        padding: '2rem',
        marginTop: '2rem',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.25)',
        color: '#fff',
        maxWidth: '700px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>
        ✍️ Create a New Blog Post
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          style={inputStyle}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here... (Markdown is supported)"
          style={{ ...inputStyle, height: '200px', color: 'whitesmoke' }}
        />
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="YouTube Video URL (optional)"
          style={inputStyle}
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated, e.g., Biochem, LabTips)"
          style={inputStyle}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: '#00b894',
            padding: '0.75rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            marginTop: '1rem',
            transition: 'background 0.3s ease',
          }}
        >
          {loading ? 'Submitting...' : 'Submit Post'}
        </button>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.2)',
  backgroundColor: 'rgba(255,255,255,0.05)',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
};

export default BlogPostForm;
