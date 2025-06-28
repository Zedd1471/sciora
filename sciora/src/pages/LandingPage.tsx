import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import FeedbackCarousel from '../components/FeedbackCarousel';

export default function LandingPage() {
  const handleEnterClassroom = () => {
    window.location.href = '/student';
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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
            style={{ fontSize: '2rem', marginBottom: '2rem', color: '#E0E0E0' }}
          >
            Live. Learn. Excel.
          </motion.p>

          <motion.button
            onClick={handleEnterClassroom}
            whileHover={{ scale: 1.05, backgroundColor: '#4ECDC4' }}
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
      <section className="section welcome-section" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Blob */}
        <svg
          viewBox="0 0 600 600"
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            zIndex: 0,
            opacity: 0.2,
            width: '400px',
            height: '400px',
          }}
        >
          <path
            fill="#4ECDC4"
            d="M421.6,306.8Q427,363.5,385.5,399.9Q344,436.3,288.5,452.5Q233,468.8,187.3,432.6Q141.5,396.5,107.3,356.5Q73,316.5,89.1,266.8Q105.3,217,134.3,173.8Q163.3,130.5,210.6,104.6Q258,78.8,305.8,101.3Q353.5,123.8,392.5,161.5Q431.5,199.3,421.6,306.8Z"
          />
        </svg>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Welcome to Sciora</h2>
          <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
            Sciora is a modern digital classroom platform designed for students and lecturers in life sciences and biotechnology...
          </p>
        </div>
      </section>

      {/* About Section */}

      <section
        className="section about-section"
        style={{
          padding: '5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4rem',
          overflow: 'hidden',
          flexWrap: 'wrap', // Ensures responsiveness on smaller screens
          background:
            'linear-gradient(rgba(255, 255, 255, 0.9), rgba(177, 187, 201, 0.95)), url(https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ flex: '1 1 400px', maxWidth: '600px' }} // Flex properties for responsiveness
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1a2a4d' }}>
            About Sciora

          </h2>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#4a5568' }}>
            Built for 21st-century learners — Sciora is responsive, fast, and focused on academic excellence. From weekly
            quizzes to peer Q&A, the platform enhances engagement between students and lecturers, especially in molecular
            biology and related fields.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{ flex: '1 1 300px', maxWidth: '400px', display: 'flex', justifyContent: 'center' }}
        >
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
            <defs>
              <linearGradient id="aboutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4ECDC4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#556270', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            <path
              fill="url(#aboutGradient)"
              d="M48.9,-59.3C62.8,-49.4,73.1,-33.6,75.9,-16.7C78.7,0.2,74,18.2,64.8,32.5C55.6,46.8,41.9,57.4,26.8,64.8C11.7,72.2,-4.8,76.4,-21.1,72.7C-37.4,69,-53.4,57.4,-64.2,42.2C-75,27,-80.6,8.2,-78.2,-9.2C-75.8,-26.6,-65.4,-42.6,-51.8,-52.7C-38.2,-62.8,-21.4,-67,-4.3,-65.1C12.8,-63.2,25.7,-69.1,38.9,-65.3C52.1,-61.5,55,-47.5,48.9,-59.3Z"
              transform="translate(100 100) scale(1.1)"
            />
          </svg>
        </motion.div>
         <FeedbackCarousel />
      </section>

      {/* Why Choose Section */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 2rem',
          background: '#f2f7ff',
          overflow: 'hidden',
        }}
      >
        {/* SVG Wave Background */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            opacity: 0.3,
          }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#4ECDC4"
            d="M0,64L48,101.3C96,139,192,213,288,224C384,235,480,181,576,165.3C672,149,768,171,864,186.7C960,203,1056,213,1152,202.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        {/* Text Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#333',
            }}
          >
            Why Choose Sciora?
          </h2>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              fontSize: '1.2rem',
              lineHeight: '2',
              color: '#444',
            }}
          >
            {[
              '🎓 Instant access to lecture materials',
              '📝 Weekly quizzes with auto-scoring',
              '🤝 Course-specific student Q&A',
              '📈 Track your academic progress',
              '🔐 Secure login with student ID',
            ].map((item, index) => (
              <li
                key={index}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '1rem 1.5rem',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                }}
              >
                
                {item}
              </li>
            ))}
          </ul>
        </div>

      </section>

      {/* Resources Section */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 2rem',
          textAlign: 'center',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1631557777150-452c4568cc14?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(10, 108, 38, 0.25)',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1,color:'white' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color:'whitesmoke' }}>
            Resources & Insights
          </h2>
          <p style={{ fontSize: '1.4rem', marginBottom: '2rem', color: 'whitesmoke' }}>
            Explore educational articles, exam tips, and student research guides curated for you.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '300px',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(53, 99, 225, 0.46)',
                color: '#fff',
              }}
            >
              <h3 style={{ marginBottom: '0.5rem', color:'white' }}>5 Tips to Write Better Lab Reports</h3>
              <p>Master structure, style, and clarity to impress your supervisors and boost scores.</p>
            </div>
            <div
              style={{
                width: '300px',
                border: '1px solid rgba(226, 221, 221, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(212, 26, 26, 0.32)',
                color: '#fff',
              }}
            >
              <h3 style={{ marginBottom: '0.5rem', color:'cyan' }}>Understanding Catabolite Repression</h3>
              <p>A short, simple guide to this important metabolic regulation concept.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
