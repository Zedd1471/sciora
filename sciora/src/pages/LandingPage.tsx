import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import FeedbackCarousel from '../components/FeedbackCarousel';
import FeedbackButton from '../components/FeedbackButton';
import KnowledgeFeed from '../components/KnowledgeFeed';

export default function LandingPage() {
  const handleEnterClassroom = () => {
    window.location.href = '/student';
  };

  const itemStyle = {
    background: '#fff',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
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
              fontSize: 'clamp(2rem, 8vw, 6rem)',
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

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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

            <Link to="/knowledgehub">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#4ECDC4' }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.1 }}
                style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1.2rem',
                  backgroundColor: '#1A535C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(26, 83, 92, 0.3)',
                  fontWeight: '600',
                }}
              >
                Visit Knowledge Hub →
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Welcome Section */}
      <section
        className="section welcome-section"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Welcome to Sciora
          </h2>
          <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
            Sciora is your gateway to mastering life sciences and biotechnology. Whether you're
            preparing for exams or supporting students in the lab, Sciora makes academic tools more
            accessible and effective.
          </p>
        </div>
      </section>

      {/* About Sciora Section */}
      <section
        className="section about-section"
        style={{
          padding: '5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4rem',
          overflow: 'hidden',
          flexWrap: 'wrap',
          background:
            'linear-gradient(rgba(255, 255, 255, 0.9), rgba(177, 187, 201, 0.95)), url(https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2070&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ flex: '1 1 400px', maxWidth: '600px' }}
        >
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#1a2a4d',
            }}
          >
            About Sciora
          </h2>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: '#4a5568' }}>
            Sciora is a modern digital classroom platform designed for students and lecturers in
            life sciences and biotechnology. Our mission is to streamline learning through
            interactive content, real-time assessments, and student-centered design.
            <br />
            <br />
            Every feature of Sciora is crafted to improve clarity and academic performance. Whether
            you're reviewing key metabolic pathways, preparing your next lab report, or tracking
            academic progress, Sciora is your partner in success.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            flex: '1 1 300px',
            maxWidth: '400px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto' }}
          >
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

{/* Why Choose Sciora Section with Glassmorphism */}
<section
  style={{
    padding: '4rem 2rem',
    backgroundImage: 'url(https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  }}
>
  <div
    style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      padding: '3rem 2rem',
      maxWidth: '900px',
      margin: '0 auto',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
    }}
  >
    <h2 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'smoke' }}>
      Why Choose Sciora?
    </h2>

    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        fontSize: '1.2rem',
        lineHeight: '2',
        color: '#f0f0f0',
      }}
    >
      {[
        '-🎓 Instant access to lecture materials',
        '-📝 Weekly quizzes with auto-scoring',
        '-🤝 Course-specific student Q&A',
        '-📈 Track your academic progress',
        '-🔐 Secure login with student ID',
      ].map((item, index) => (
        <li key={index} style={{ marginBottom: '1.5rem', color: 'gray' }}>
          {item}
        </li>
      ))}
    </ul>
  </div>
</section>

{/* Knowledge Hub Preview with Background and Glassmorphism */}
<section
  style={{
    padding: '4rem 2rem',
        background: `url('https://images.unsplash.com/photo-1642428668784-43cdfca2813e?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0')no-repeat center center fixed`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    textAlign: 'center',
    position: 'relative',
  }}
>
  <div
    style={{
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(140, 25, 25, 0.55)',
      padding: '3rem 2rem',
      maxWidth: '900px',
      margin: '0 auto',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
    }}
  >
    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'whitesmoke' }}>
      Knowledge Hub Preview
    </h2>
    <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#f0f0f0' }}>
      Recent resources and academic tips from students and lecturers.
    </p>

    <KnowledgeFeed limit={4} />

    <Link to="/knowledgehub">
      <button
        style={{
          marginTop: '2rem',
          padding: '0.8rem 2rem',
          fontSize: '1rem',
          backgroundColor: '#1A535C',
          color: '#fff',
          border: 'none',
          borderRadius: '40px',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        Go to Knowledge Hub →
      </button>
    </Link>
  </div>
</section>
      {/* Footer */}
      <Footer />
      <FeedbackButton />
    </>
  );
}
