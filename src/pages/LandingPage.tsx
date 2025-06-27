import { motion } from 'framer-motion';
import Footer from '../components/Footer';

export default function LandingPage() {
  const handleEnterClassroom = () => {
    window.location.href = '/student';
  };

  return (
    <>
      {/* Hero Section */}
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1648792940059-3b782a7b8b20?q=80&w=1932&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(8, 8, 8, 0.57)',
            zIndex: 1,
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'relative',
            textAlign: 'center',
            color: 'white',
            maxWidth: '800px',
            padding: '0 2rem 6rem',
            zIndex: 2,
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontSize: '6rem',
              marginBottom: '1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, rgb(154, 184, 199), #4ECDC4)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textFillColor: 'transparent',
            }}
          >
            Sciora
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              fontSize: '2rem',
              marginBottom: '2rem',
              color: '#E0E0E0',
            }}
          >
            Live. Learn. Excel.
          </motion.p>
          <motion.button
            onClick={handleEnterClassroom}
            whileHover={{
              scale: 1.05,
              backgroundColor: '#4ECDC4',
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.1 }}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.2rem',
              backgroundColor: '#FF6B6B',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
              fontWeight: '600',
            }}
          >
            Enter Classroom →
          </motion.button>
        </motion.div>
      </div>

      {/* Welcome Section */}
      <section style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#121212', color: '#f5f5f5' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Welcome to Sciora</h2>
        <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Sciora is a modern digital classroom platform designed for students and lecturers in life sciences and biotechnology.
          We simplify academic workflows — from accessing lecture materials to submitting assignments and taking assessments —
          all in one seamless interface.
        </p>
      </section>

      {/* About Section */}
      <section style={{ padding: '3rem 2rem', backgroundColor: '#ffffff', color: '#333', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>About Sciora</h2>
        <p style={{ fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
          Built for 21st-century learners — Sciora is responsive, fast, and focused on academic excellence. From weekly quizzes
          to peer Q&A, the platform enhances engagement between students and lecturers, especially in molecular biology and
          related fields.
        </p>
      </section>

      {/* Why Choose Section */}
      <section style={{ padding: '3rem 2rem', backgroundColor: '#f9f9f9', color: '#111' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
          Why Choose Sciora?
        </h2>
        <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', listStyle: 'none', paddingLeft: '0', maxWidth: '800px', margin: '0 auto' }}>
          <li>🎓 Instant access to lecture materials</li>
          <li>📝 Weekly quizzes with auto-scoring</li>
          <li>🤝 Course-specific student Q&A</li>
          <li>📈 Track your academic progress</li>
          <li>🔐 Secure login with student ID</li>
        </ul>
      </section>

      {/* Resources Section */}
      <section style={{ padding: '3rem 2rem', backgroundColor: '#e9e9ff', color: '#222', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Resources & Insights</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
          Explore educational articles, exam tips, and student research guides curated for you.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ width: '300px', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3>5 Tips to Write Better Lab Reports</h3>
            <p>Master structure, style, and clarity to impress your supervisors and boost scores.</p>
          </div>
          <div style={{ width: '300px', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3>Understanding Catabolite Repression</h3>
            <p>A short, simple guide to this important metabolic regulation concept.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
