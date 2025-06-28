import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

const NotesTab: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('code');
    if (data) setCourses(data);
  };

  const handleFileUpload = async () => {
    if (!file || !selectedCourse) {
      setMessage('Select course and file.');
      return;
    }

    setUploading(true);
    setMessage('');

    const fileExt = file.name.split('.').pop();
    const filePath = `${selectedCourse}/${Date.now()}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('lecture_notes')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Upload failed.');
      setUploading(false);
      return;
    }

    const publicURL = supabase.storage
      .from('lecture_notes')
      .getPublicUrl(filePath).data.publicUrl;

    const { error: insertError } = await supabase.from('notes').insert({
      course_code: selectedCourse,
      filename: file.name,
      url: publicURL,
    });

    if (insertError) {
      setMessage('Failed to save file info.');
    } else {
      setMessage('File uploaded!');
      setFile(null);
    }

    setUploading(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Upload Lecture Notes</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          style={{ padding: '0.5rem' }}
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.code}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button onClick={handleFileUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Note'}
        </button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default NotesTab;
