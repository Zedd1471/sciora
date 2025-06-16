import { motion } from 'framer-motion';

export default function LandingPage() {
  const handleEnterClassroom = () => {
    window.location.href = '/student';
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url(https://images.unsplash.com/photo-1648792940059-3b782a7b8b20?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
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
          padding: '0 2rem',
          zIndex: 2,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontSize: '9.5rem',
            marginBottom: '1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg,rgb(154, 184, 199), #4ECDC4)',
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
            fontSize: '3.5rem',
            marginBottom: '2rem',
            color: '#E0E0E0',
          }}
        >
          Live. Learn. Excel.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          style={{
            fontSize: '2.2rem',
            marginBottom: '3rem',
            color: '#BDBDBD',
            lineHeight: '1.6',
          }}
        >
          Experience a revolutionary approach to education where technology meets
          pedagogy. Join us in shaping the future of learning.
        </motion.div>
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
  );
}
