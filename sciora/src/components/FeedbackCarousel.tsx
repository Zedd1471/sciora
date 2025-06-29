import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabaseClient'; // adjust path if needed

interface Feedback {
  message: string;
  name: string;
  course: string;
}

const FeedbackCarousel = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [current, setCurrent] = useState(0);
useEffect(() => {
  const fetchFeedback = async () => {
    const { data, error } = await supabase
      .from('feedback')
      .select('message, name, course, submitted_at')
      .order('submitted_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase error:', error);
    } else {
      setFeedbacks(data.filter(f => f.message)); // filter out empty messages
    }
  }; // ✅ this closing brace was probably missing

  fetchFeedback();
}, []);

  useEffect(() => {
    if (feedbacks.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % feedbacks.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [feedbacks]);

  if (feedbacks.length === 0) return null;

  const currentFeedback = feedbacks[current];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 mt-10 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-2">
          💬 What Students Are Saying
        </h2>
        <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
          Real feedback from students using Sciora for quizzes, lecture notes, and academic support.
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border mx-auto max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl italic text-gray-800 mb-6 leading-relaxed">
              “{currentFeedback.message}”
            </p>
            <p className="font-semibold text-indigo-700 text-lg">
              — {currentFeedback.name || 'Anonymous'}, <span className="text-gray-500">{currentFeedback.course}</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeedbackCarousel;
