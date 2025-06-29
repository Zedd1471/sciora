import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function FeedbackButton() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert('Feedback cannot be empty.');
      return;
    }

    const { error } = await supabase.from('feedback').insert([{ name: name || null, message }]);

    if (error) {
      console.error(error);
      alert('Error submitting feedback.');
    } else {
      alert('Thank you for your feedback!');
      setShowForm(false);
      setName('');
      setMessage('');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setShowForm(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#007aff',
          color: '#fff',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '1.5rem',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
        title="Send Feedback"
      >
        💬
      </div>

      {/* Modal Form */}
      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1001,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '400px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ marginBottom: '1rem' }}>Submit Feedback</h3>
            <input
              type="text"
              placeholder="Your Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem' }}
            />
            <textarea
              placeholder="Your Feedback"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: '100%', height: '100px', padding: '0.6rem', marginBottom: '1rem' }}
            />
            <button onClick={handleSubmit} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#007aff', color: '#fff', border: 'none', borderRadius: '6px' }}>
              Submit
            </button>
            <div
              onClick={() => setShowForm(false)}
              style={{ marginTop: '1rem', cursor: 'pointer', color: '#007aff' }}
            >
              Cancel
            </div>
          </div>
        </div>
      )}
    </>
  );
}
