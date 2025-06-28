import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const ResourceUploader = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState('');
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    setStatus('Uploading...');

    if (!title || (type === 'pdf' && !file) || (type === 'video' && !videoURL)) {
      setStatus('Please fill out all required fields.');
      return;
    }

    let publicURL = videoURL;

    if (type === 'pdf' && file) {
      const filePath = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('resources') // replace with your bucket name if different
        .upload(filePath, file);

      if (error) {
        console.error(error);
        setStatus('❌ Failed to upload file.');
        return;
      }

      const { data: urlData } = supabase.storage.from('resources').getPublicUrl(filePath);
      publicURL = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from('resources').insert([
      {
        title,
        description,
        url: publicURL,
        type,
      },
    ]);

    if (insertError) {
      console.error(insertError);
      setStatus('❌ Failed to save resource.');
    } else {
      setStatus('✅ Resource uploaded!');
      setTitle('');
      setDescription('');
      setType('pdf');
      setFile(null);
      setVideoURL('');
    }
  };

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '6px' }}>
      <h3>📤 Upload Resource</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      >
        <option value="pdf">PDF</option>
        <option value="video">YouTube Video</option>
      </select>
      {type === 'pdf' && (
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ marginBottom: '0.5rem' }}
        />
      )}
      {type === 'video' && (
        <input
          type="text"
          placeholder="YouTube Video URL"
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
      )}
      <button onClick={handleUpload} style={{ padding: '0.5rem 1rem' }}>
        Upload
      </button>
      <p>{status}</p>
    </div>
  );
};

export default ResourceUploader;
