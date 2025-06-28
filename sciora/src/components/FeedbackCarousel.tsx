// src/components/FeedbackCarousel.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Feedback {
  quote: string;
  name: string;
  dept: string;
}

const feedbacks: Feedback[] = [
  {
    quote: "Sciora helped me prepare better for weekly quizzes. It's now part of my routine.",
    name: "Grace A.",
    dept: "BTH 504"
  },
  {
    quote: "The lecture notes are clear and easy to follow. I like how everything is organized.",
    name: "Michael E.",
    dept: "BTG 404"
  },
  {
    quote: "I asked a question and got two helpful responses in less than an hour!",
    name: "Zainab M.",
    dept: "BTH 304"
  },
  {
    quote: "The timer for quizzes is intense, but it helps me stay sharp. Love the challenge.",
    name: "Tolu B.",
    dept: "BTH 308"
  }
];

const FeedbackCarousel = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % feedbacks.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleFeedbackClick = () => {
    navigate("/submit-feedback");
  };

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
              “{feedbacks[current].quote}”
            </p>
            <p className="font-semibold text-indigo-700 text-lg">
              — {feedbacks[current].name}, <span className="text-gray-500">{feedbacks[current].dept}</span>
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10">
          <button
            onClick={handleFeedbackClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-3 rounded-full shadow-md transition duration-300 active:scale-95 focus:outline-none focus:ring focus:ring-indigo-300"
          >
            Submit Your Feedback
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeedbackCarousel;
