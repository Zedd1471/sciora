import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import styled from "styled-components";
import Header from "../components/Header"; // Adjust path if needed

// Types
type Course = { id: string; name: string };
type Note = { id: string; title: string; file_url: string; week: number };
type Quiz = { id: string; title: string; week: number; num_questions?: number; timer_seconds?: number };
type Question = { id: string; question_text: string; options: string[]; correct_option: number };
type QuizResult = { id: string; quiz_id: string; student_id: string; score: number; total: number; taken_at: string };

// Styled Components with Glass Morphism
const PageContainer = styled.div`
  min-height: 100vh;
  background-image: url("https://images.unsplash.com/photo-1740635341299-3b8e3490f546?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CourseLayout = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  min-width: 250px;
  flex: 1;
  
  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
  }
`;

const MainContent = styled.main`
  flex: 2;
  min-width: 300px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 1.5rem;
  }
`;

const CourseButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => $active 
    ? 'rgba(14, 23, 41, 0.7)' 
    : 'rgba(30, 217, 220, 0.6)'};
  color: ${({ $active }) => $active ? "#fff" : "#2d3e50"};
  border: none;
  border-radius: 8px;
  padding: 0.85rem 1.25rem;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-bottom: 0.75rem;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 140, 255, 0.2);
  }
  
  &:focus {
    outline: 2px solidrgb(8, 17, 35);
    outline-offset: 2px;
  }
`;

const StudentPanelContainer = styled.div`
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
`;

const SectionDivider = styled.div`
  width: 6px;
  height: 28px;
  background:rgb(13, 26, 49);
  border-radius: 3px;
  margin-right: 12px;
`;

const NoteLink = styled.a`
  display: inline-flex;
  align-items: center;
  background: rgba(230, 240, 255, 0.7);
  color: #2d3e50;
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(79, 140, 255, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  margin: 8px 8px 0 0;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 140, 255, 0.2);
  }
  
  &:focus {
    outline: 2px solidrgb(152, 156, 162);
    outline-offset: 2px;
  }
`;

const QuizButton = styled.button`
  background: rgba(231, 154, 65, 0.77);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-weight: bold;
  font-size: 1.08rem;
  box-shadow: 0 2px 8px rgba(79, 140, 255, 0.2);
  cursor: pointer;
  text-align: left;
  line-height: 1.4;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
  margin-bottom: 16px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 140, 255, 0.3);
  }
  
  &:focus {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;  width: 50vw;
  height: 56vh;
  background: rgba(89, 117, 173, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div<{
  $isQuizActive?: boolean;
  $isStudentIdEntry?: boolean; // Added this prop
}>`
  background: ${({ $isStudentIdEntry }) => $isStudentIdEntry ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: ${({ $isStudentIdEntry }) => $isStudentIdEntry ? 'none' : 'blur(30px)'};
  -webkit-backdrop-filter: ${({ $isStudentIdEntry }) => $isStudentIdEntry ? 'none' : 'blur(30px)'};
  border-radius: 16px; // Keep border-radius for the inner content if it needs it, or remove if inner content has its own
  padding: ${({ $isQuizActive, $isStudentIdEntry }) => 
    $isStudentIdEntry ? '0' : 
    $isQuizActive ? '2rem 2.5rem' : '1.5rem 2rem'}; // Set padding to 0 for student ID entry
  box-shadow: ${({ $isStudentIdEntry }) => $isStudentIdEntry ? 'none' : '0 8px 32px 0 rgba(31, 38, 135, 0.2)'};
  border: ${({ $isStudentIdEntry }) => $isStudentIdEntry ? 'none' : '1px solid rgba(255, 255, 255, 0.18)'};
  position: relative;
  width: ${({ $isQuizActive, $isStudentIdEntry }) => 
    $isStudentIdEntry ? 'clamp(320px, 90vw, 450px)' : // Adjusted width slightly for student ID entry, can be 'auto' if needed
    $isQuizActive ? 'clamp(320px, 90vw, 800px)' : 'clamp(300px, 80vw, 600px)'};
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  // Ensure content within is centered if ModalContent itself becomes a transparent container
  align-items: ${({ $isStudentIdEntry }) => $isStudentIdEntry ? 'center' : 'initial'};
  justify-content: ${({ $isStudentIdEntry }) => $isStudentIdEntry ? 'center' : 'initial'};

  @media (max-width: 768px) {
    width: ${({ $isQuizActive, $isStudentIdEntry }) => 
      $isStudentIdEntry ? '90vw' : 
      $isQuizActive ? '95vw' : '90vw'};
    padding: ${({ $isQuizActive, $isStudentIdEntry }) => 
      $isStudentIdEntry ? '0' : 
      $isQuizActive ? '1.5rem 2rem' : '1rem 1.5rem'};
    max-height: 85vh;
  }

  @media (max-width: 480px) {
    padding: ${({ $isQuizActive, $isStudentIdEntry }) => 
      $isStudentIdEntry ? '0' : 
      $isQuizActive ? '1rem 1.5rem' : '1rem'};
  }
`;

const CourseIcon = styled.span`
  margin-right: 10px;
  font-size: 1.2rem;
`;

const NoteIcon = styled.span`
  margin-right: 8px;
  font-size: 1.1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: #2d3e50;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.1);
  }
  
  &:focus {
    outline: 2px solid #4f8cff;
    outline-offset: 2px;
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #4f8cff;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  color: #888;
  text-align: center;
  padding: 2rem;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #4f8cff;
  opacity: 0.5;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 8px;
  background: rgba(230, 240, 255, 0.5);
  border-radius: 4px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background: #4f8cff;
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(79, 140, 255, 0.15);
  color: #4f8cff;
  margin-left: 8px;
`;

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin-bottom: 2rem;
`;

const ScoreCircle = styled.div<{ $score: number, $total: number }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    #4f8cff ${props => (props.$score / props.$total) * 100}%, 
    rgba(230, 240, 255, 0.7) 0%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: white;
  }
`;

const ScoreText = styled.div`
  position: relative;
  z-index: 1;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3e50;
`;

const QuizProgress = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`;

const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  
  &:hover span {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipText = styled.span`
  visibility: hidden;
  width: 200px;
  background-color: rgba(45, 62, 80, 0.9);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.85rem;
  
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: rgba(45, 62, 80, 0.9) transparent transparent transparent;
  }
`;

// Utility
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// StudentPanel component
const StudentPanel: React.FC<{
  notes: Note[];
  quizzes: Quiz[];
  onQuizClick: (quiz: Quiz) => void;
}> = ({ notes, quizzes, onQuizClick }) => {
  return (
    <StudentPanelContainer>
      <div style={{ marginBottom: 32 }}>
        <SectionHeader>
          <SectionDivider />
          <SectionTitle>Lecture Notes</SectionTitle>
        </SectionHeader>
        {notes.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#888", background: "rgba(255, 255, 255, 0.5)", borderRadius: "8px" }}>
            <EmptyStateIcon>📄</EmptyStateIcon>
            <p>No notes available for this course yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {notes.map((note) => (
              <NoteLink
                key={note.id}
                href={note.file_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <NoteIcon>📄</NoteIcon> {note.title} 
                {note.week ? <Badge>Week {note.week}</Badge> : ""}
              </NoteLink>
            ))}
          </div>
        )}
      </div>

      <div>
        <SectionHeader>
          <SectionDivider />
          <SectionTitle>Quizzes</SectionTitle>
        </SectionHeader>
        {quizzes.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#888", background: "rgba(255, 255, 255, 0.5)", borderRadius: "8px" }}>
            <EmptyStateIcon>📝</EmptyStateIcon>
            <p>No quizzes available for this course yet.</p>
          </div>
        ) : (
          <div>
            {quizzes.map((quiz) => (
              <QuizButton key={quiz.id} onClick={() => onQuizClick(quiz)}>
                <div style={{ fontSize: "1.05rem", marginBottom: 4 }}>
                  📝 {quiz.title} <Badge>Week {quiz.week}</Badge>
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: "normal", display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <span>📘 {quiz.num_questions || 5} Questions</span>
                  <span>⏱️ {quiz.timer_seconds ? `${Math.floor(quiz.timer_seconds / 60)} min` : "No time limit"}</span>
                </div>
              </QuizButton>
            ))}
          </div>
        )}
      </div>
    </StudentPanelContainer>
  );
};

// QuizTaker component
const QuizTaker: React.FC<{ quiz: Quiz; onBack: () => void }> = ({
  quiz,
  onBack,
}) => {
  const [studentId, setStudentId] = useState("");
  const [idEntered, setIdEntered] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [checkingRetake, setCheckingRetake] = useState(false);
  const numQuestions = quiz.num_questions || 5;
  const timerSeconds = quiz.timer_seconds || 0;
  const [timeLeft, setTimeLeft] = useState(timerSeconds);

  const handleStartQuiz = async () => {
    setErrorMsg("");
    if (!studentId.startsWith("BTH/")) {
      setErrorMsg("Only students with ID starting with 'BTH/' can take this quiz.");
      return;
    }
    setCheckingRetake(true);
    const { data } = await supabase
      .from("quiz_results")
      .select("id")
      .eq("quiz_id", quiz.id)
      .eq("student_id", studentId)
      .maybeSingle();
    setCheckingRetake(false);
    if (data) {
      setErrorMsg("You have already taken this quiz. Retakes are not allowed.");
      return;
    }
    setIdEntered(true);
  };

  useEffect(() => {
    if (!idEntered) return;
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("quiz_id", quiz.id);
      if (!error && data) {
        const shuffledQuestions = shuffleArray(data).map((q: Question) => {
          const optionObjs = q.options.map((opt, idx) => ({
            text: opt,
            originalIdx: idx,
          }));
          const shuffledOptions = shuffleArray(optionObjs);
          const newOptions = shuffledOptions.map((o) => o.text);
          const newCorrect = shuffledOptions.findIndex(
            (o) => o.originalIdx === q.correct_option
          );
          return {
            ...q,
            options: newOptions,
            correct_option: newCorrect,
          };
        });
        const pickedQuestions = shuffledQuestions.slice(0, numQuestions);
        setQuestions(pickedQuestions);
        setAnswers(Array(pickedQuestions.length).fill(-1));
        setTimeLeft(timerSeconds);
      }
    };
    fetchQuestions();
    // eslint-disable-next-line
  }, [quiz.id, idEntered]);

  useEffect(() => {
    if (!idEntered || timerSeconds === 0 || showResult) return;
    if (timeLeft <= 0) {
      setShowResult(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [idEntered, timeLeft, timerSeconds, showResult]);

  const score = answers.reduce(
    (acc, ans, idx) =>
      ans === questions[idx]?.correct_option ? acc + 1 : acc,
    0
  );

  useEffect(() => {
    const saveResult = async () => {
      if (showResult && studentId && questions.length > 0) {
        setSaving(true);
        await supabase.from("quiz_results").insert([
          {
            quiz_id: quiz.id,
            student_id: studentId,
            score,
            total: questions.length,
            taken_at: new Date().toISOString(),
          },
        ]);
        setSaving(false);
      }
    };
    saveResult();
    // eslint-disable-next-line
  }, [showResult]);

  if (!idEntered) {
    return (
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h4 style={{ marginBottom: "1rem", color: "#2d3e50" }}>
          Enter your Matric Number / Student ID to start the quiz
        </h4>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="e.g. BTH/123456"
          style={{
            padding: "0.75rem",
            width: "100%",
            marginBottom: "1rem",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "1rem",
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            boxSizing: 'border-box' // Added to include padding and border in the element's total width and height
          }}
        />
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleStartQuiz}
            disabled={!studentId || checkingRetake}
            style={{
              background: "#4f8cff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "0.75rem 1.5rem",
              fontWeight: "bold",
              cursor: !studentId || checkingRetake ? "not-allowed" : "pointer",
              flex: 1,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            {checkingRetake ? "Checking..." : "Start Quiz"}
          </button>
          <button
            onClick={onBack}
            style={{
              background: "rgba(240, 244, 255, 0.7)",
              color: "#2d3e50",
              border: "none",
              borderRadius: 6,
              padding: "0.75rem 1.5rem",
              fontWeight: "bold",
              cursor: "pointer",
              flex: 1,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            Cancel
          </button>
        </div>
        {errorMsg && <p style={{ color: "#ff4444", marginTop: "1rem", textAlign: 'center' }}>{errorMsg}</p>}
      </div>
    );
  }

  if (questions.length === 0) return <p>Loading questions...</p>;

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
    else setShowResult(true);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  if (showResult)
    return (
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <ResultCard>
          <h4 style={{ color: "#2d3e50", marginBottom: "1rem" }}>Quiz Complete!</h4>
          <ScoreCircle $score={score} $total={questions.length}>
            <ScoreText>
              {score}/{questions.length}
            </ScoreText>
          </ScoreCircle>
          <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
            {score === questions.length 
              ? "Perfect score! 🎉" 
              : score >= questions.length * 0.7 
                ? "Great job! 👏" 
                : score >= questions.length * 0.5 
                  ? "Good effort! 👍" 
                  : "Keep practicing! 💪"}
          </p>
          <p style={{ color: "#666", marginBottom: "1rem" }}>
            You answered {score} out of {questions.length} questions correctly.
          </p>
        </ResultCard>
        {saving ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <LoadingSpinner />
            <p>Saving your result...</p>
          </div>
        ) : (
          <button
            onClick={onBack}
            style={{
              background: "#4f8cff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "0.75rem 1.5rem",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              width: "100%",
            }}
          >
            Back to Quizzes
          </button>
        )}
      </div>
    );

  const q = questions[current];
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      {timerSeconds > 0 && !showResult && (
        <div style={{
          fontWeight: "bold",
          color: timeLeft < 60 ? "#ff4444" : "#4f8cff",
          marginBottom: "1rem",
          fontSize: "1.1rem",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}>
          <span>⏱️</span>
          <span>Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
        </div>
      )}
      
      <QuizProgress>
        <span>Question {current + 1} of {questions.length}</span>
        <span>{Math.round((answers.filter(a => a !== -1).length / questions.length) * 100)}% completed</span>
      </QuizProgress>
      <ProgressBar $progress={(current + 1) / questions.length * 100} />
      
      <p style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "1.5rem", color: "#2d3e50" }}>
        {q.question_text}
      </p>
      <ul style={{ paddingLeft: 0, margin: "0 0 1.5rem 0", listStyle: "none" }}>
        {q.options.map((opt, idx) => (
          <li
            key={idx}
            onClick={() => handleAnswer(idx)}
            style={{
              display: "flex",
              alignItems: "center",
              background: answers[current] === idx 
                ? 'rgba(230, 240, 255, 0.7)' 
                : 'rgba(255, 255, 255, 0.6)',
              border: answers[current] === idx 
                ? "2px solid rgba(79, 140, 255, 0.8)" 
                : "1px solid rgba(219, 234, 254, 0.5)",
              borderRadius: 8,
              padding: "1rem 1.25rem",
              marginBottom: 12,
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              transition: "all 0.2s ease",
              fontWeight: answers[current] === idx ? "bold" : "normal",
              fontSize: "1rem",
              userSelect: "none",
              boxShadow: answers[current] === idx ? "0 2px 8px rgba(79, 140, 255, 0.2)" : "none",
              transform: answers[current] === idx ? "translateY(-2px)" : "none",
            }}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") handleAnswer(idx);
            }}
            aria-checked={answers[current] === idx}
            role="radio"
          >
            <input
              type="radio"
              name={`q${current}`}
              checked={answers[current] === idx}
              onChange={() => handleAnswer(idx)}
              style={{
                marginRight: 16,
                accentColor: "#4f8cff",
                width: 18,
                height: 18,
                cursor: "pointer",
              }}
              tabIndex={-1}
            />
            <span>{opt}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <button
          onClick={handlePrev}
          disabled={current === 0}
          style={{
            background: "rgba(240, 244, 255, 0.7)",
            color: "#2d3e50",
            border: "none",
            borderRadius: 6,
            padding: "0.75rem 1.5rem",
            fontWeight: "bold",
            cursor: current === 0 ? "not-allowed" : "pointer",
            opacity: current === 0 ? 0.6 : 1,
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            flex: 1,
            transition: "all 0.2s ease",
          }}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={answers[current] === -1}
          style={{
            background: "#4f8cff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "0.75rem 1.5rem",
            fontWeight: "bold",
            cursor: answers[current] === -1 ? "not-allowed" : "pointer",
            opacity: answers[current] === -1 ? 0.6 : 1,
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            flex: 1,
            transition: "all 0.2s ease",
          }}
        >
          {current === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <Tooltip>
          <span style={{ fontSize: "0.9rem", color: "#666", cursor: "help" }}>Keyboard shortcuts available</span>
          <TooltipText>Use arrow keys to navigate between questions. Press spacebar to select an option.</TooltipText>
        </Tooltip>
      </div>
    </div>
  );
};

// Main StudentPage
const StudentPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("courses").select("*");
      if (!error && data) setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) {
      setNotes([]);
      return;
    }
    const fetchNotes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("course_id", selectedCourse)
        .order("week", { ascending: true });
      if (!error && data) setNotes(data);
      setLoading(false);
    };
    fetchNotes();
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedCourse) {
      setQuizzes([]);
      return;
    }
    const fetchQuizzes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("course_id", selectedCourse)
        .order("week", { ascending: true });
      if (!error && data) setQuizzes(data);
      setLoading(false);
    };
    fetchQuizzes();
  }, [selectedCourse]);
  
  // Add keyboard navigation for quiz
  useEffect(() => {
    if (!selectedQuiz) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedQuiz(null);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedQuiz, setSelectedQuiz]);

  return (
    <PageContainer>
      <ContentWrapper>
        <h2 style={{ fontWeight: 700, color: "#2d3e50", marginBottom: "0.5rem" }}>
          Welcome to your e-Classroom
        </h2>
        <p style={{ color: "#555", marginBottom: "2rem" }}>
          Select a course to download notes and take quizzes:
        </p>
        
        <CourseLayout>
          <Sidebar>
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <LoadingSpinner />
                <p style={{ marginTop: "1rem", color: "#666" }}>Loading courses...</p>
              </div>
            ) : (
              <div>
                <h3 style={{ color: "#2d3e50", marginBottom: "1rem" }}>Your Courses</h3>
                {courses.length === 0 ? (
                  <div style={{ padding: "1.5rem", textAlign: "center", color: "#888", background: "rgba(255, 255, 255, 0.5)", borderRadius: "8px" }}>
                    <EmptyStateIcon>🏫</EmptyStateIcon>
                    <p>No courses available yet.</p>
                  </div>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {courses.map((course) => (
                      <li key={course.id} style={{ marginBottom: "0.75rem" }}>
                        <CourseButton
                          $active={selectedCourse === course.id}
                          onClick={() => setSelectedCourse(course.id)}
                        >
                          <CourseIcon>📚</CourseIcon>
                          {course.name}
                        </CourseButton>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </Sidebar>
          
          <MainContent>
            {selectedCourse ? (
              loading ? (
                <div style={{ padding: "3rem", textAlign: "center" }}>
                  <LoadingSpinner />
                  <p style={{ marginTop: "1rem", color: "#666" }}>Loading course content...</p>
                </div>
              ) : (
                <>
                  <StudentPanel
                    notes={notes}
                    quizzes={quizzes}
                    onQuizClick={quiz => setSelectedQuiz(quiz)}
                  />
                  {selectedQuiz && (
                    <ModalOverlay>
                      <ModalContent>
                        <CloseButton onClick={() => setSelectedQuiz(null)}>×</CloseButton>
                        <QuizTaker quiz={selectedQuiz} onBack={() => setSelectedQuiz(null)} />
                      </ModalContent>
                    </ModalOverlay>
                  )}
                </>
              )
            ) : (
              <EmptyState>
                <EmptyStateIcon>📚</EmptyStateIcon>
                <p>Please select a course to view content</p>
              </EmptyState>
            )}
          </MainContent>
        </CourseLayout>
      </ContentWrapper>
    </PageContainer>
  );
};

export default StudentPage;