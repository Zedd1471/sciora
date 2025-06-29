import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const KnowledgePostForm = () => {
  const [author_name, setAuthorName] = useState('');
  const [level, setLevel] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!author_name || !level || !department || !title || !content) {
      alert('Please fill all required fields');
      return;
    }

    if (videoUrl && mediaFile) {
      alert('Only one of media file or video URL is allowed');
      return;
    }

    setLoading(true);

    let mediaUrl = null;

    if (mediaFile) {
      const fileExt = mediaFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('knowledge-media')
        .upload(fileName, mediaFile);

      if (error) {
        alert('File upload failed');
        setLoading(false);
        return;
      }

      const { publicUrl } = supabase.storage.from('knowledge-media').getPublicUrl(fileName).data;
      mediaUrl = publicUrl;
    }

    const { error: insertError } = await supabase.from('knowledge_posts').insert([
      {
        author_name,
        level,
        department,
        title,
        content,
        media_url: mediaUrl,
        video_url: videoUrl || null,
      },
    ]);

    if (insertError) {
      alert('Error submitting post');
      console.error(insertError);
    } else {
      alert('Post submitted!');
      setAuthorName('');
      setLevel('');
      setDepartment('');
      setTitle('');
      setContent('');
      setVideoUrl('');
      setMediaFile(null);
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
        📘 Share to the Knowledge Hub
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          value={author_name}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Your Name"
          style={inputStyle}
        />
        <input
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          placeholder="Level (e.g. 400)"
          style={inputStyle}
        />
        <input
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Department"
          style={inputStyle}
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          style={inputStyle}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here..."
          style={{ ...inputStyle, height: '120px', color: 'whitesmoke' }}
        />

        <div>
          <label style={{ fontSize: '0.85rem', color: 'whitesmoke' }}>📎 Upload an image or PDF (optional)</label><br />
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
            style={{ marginTop: '0.3rem', color: '#fff' }}
          />
          {mediaFile && (
            <p style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '0.5rem' }}>
              Selected File: {mediaFile.name}
            </p>
          )}
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>🎥 Video URL (optional)</label><br />
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

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

export default KnowledgePostForm;
