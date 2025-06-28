import React, { useState } from 'react';
import QuizzesTab from './tabs/QuizzesTab';
import CoursesTab from './tabs/CoursesTab';
import NotesTab from './tabs/NotesTab';
import ResultsTab from './tabs/ResultsTab';
import styled from 'styled-components';

interface Props {
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('results');

  const renderTab = () => {
    switch (activeTab) {
      case 'quizzes':
        return <QuizzesTab />;
      case 'courses':
        return <CoursesTab />;
      case 'notes':
        return <NotesTab />;
      case 'results':
      default:
        return <ResultsTab />;
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem' }}>Admin Dashboard</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
        <button onClick={() => setActiveTab('results')}>Results</button>
        <button onClick={() => setActiveTab('quizzes')}>Quizzes</button>
        <button onClick={() => setActiveTab('courses')}>Courses</button>
        <button onClick={() => setActiveTab('notes')}>Notes</button>
        <button onClick={onLogout} style={{ background: '#ff4d4f', color: '#fff' }}>Logout</button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        {renderTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;
