import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

const CoursesTab: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (data) setCourses(data);
    if (error) console.error('Fetch error:', error);
  };

  const handleAddCourse = async () => {
    if (!code.trim() || !name.trim()) return;

    setLoading(true);
    setMessage('');

    const { error } = await supabase.from('courses').insert({
      code: code.toUpperCase(),
      name,
    });

    if (error) {
      setMessage('Error adding course.');
    } else {
      setMessage('Course added successfully.');
      setCode('');
      setName('');
      fetchCourses();
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Courses</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Course Code (e.g. BTH 304)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ padding: '0.5rem', flex: 1, minWidth: '200px' }}
        />
        <input
          type="text"
          placeholder="Course Name (e.g. Microbial Genetics)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '0.5rem', flex: 2, minWidth: '300px' }}
        />
        <button onClick={handleAddCourse} disabled={loading}>
          {loading ? 'Adding...' : 'Add Course'}
        </button>
      </div>

      {message && <p>{message}</p>}

      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <strong>{course.code}</strong>: {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoursesTab;
