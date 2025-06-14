import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import Header from "../components/Header"; // Adjust path if needed

// Types
type Course = { id: string; name: string };
type Note = { id: string; title: string; file_url: string; week: number };
type Quiz = { id: string; title: string; week: number; num_questions?: number; timer_seconds?: number };
type Question = { id: string; question_text: string; options: string[]; correct_option: number };
type QuizResult = { id: string; quiz_id: string; student_id: string; score: number; total: number; taken_at: string };

// Utility
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// StudentPanel component for notes and quizzes
const StudentPanel: React.FC<{
  notes: Note[];
  quizzes: Quiz[];
  onQuizClick: (quiz: Quiz) => void;
}> = ({ notes, quizzes, onQuizClick }) => {
  return (
    <div
      style={{
        background: "rgba(240, 244, 250, 0.75)", // grayish and transparent
        borderRadius: 10,
        boxShadow: "0 4px 24px rgba(44,62,80,2.30)",
        padding: "2rem 2.5rem",
        minWidth: 350,
        maxWidth: 600,
        marginLeft: 24,
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <div
            style={{
              width: 6,
              height: 28,
              background: "#4f8cff",
              borderRadius: 3,
              marginRight: 12,
            }}
          />
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>
            Lecture Notes
          </h2>
        </div>
        {notes.length === 0 ? (
          <span style={{ color: "#888" }}>No notes available.</span>
        ) : (
          notes.map((note) => (
            <a
              key={note.id}
              href={note.file_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#e6f0ff",
                color: "#2d3e50",
                padding: "0.7rem 1.2rem",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 500,
                boxShadow: "0 2px 8px #4f8cff11",
                marginTop: 8,
                marginRight: 8,
              }}
            >
              📄 {note.title} {note.week ? `(Week ${note.week})` : ""}
            </a>
          ))
        )}
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <div
            style={{
              width: 6,
              height: 28,
              background: "#4f8cff",
              borderRadius: 3,
              marginRight: 12,
            }}
          />
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>
            Quizzes
          </h2>
        </div>
        {quizzes.length === 0 ? (
          <span style={{ color: "#888" }}>No quizzes available.</span>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
{quizzes.map((quiz) => (
  <button
    key={quiz.id}
    style={{
      background: "#4f8cff",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "1rem 1.5rem",
      fontWeight: "bold",
      fontSize: "1.08rem",
      boxShadow: "0 2px 8px #4f8cff22",
      cursor: "pointer",
      textAlign: "left",
      lineHeight: 1.4,
    }}
    onClick={() => onQuizClick(quiz)}
  >
    <div style={{ fontSize: "1.05rem", marginBottom: 4 }}>
      📝 {quiz.title} (Week {quiz.week})
    </div>
    <div style={{ fontSize: "0.95rem", fontWeight: "normal" }}>
      📘 {quiz.num_questions || 5} Questions &nbsp; | &nbsp;
      ⏱️ {quiz.timer_seconds ? `${Math.floor(quiz.timer_seconds / 60)} min` : "No time limit"}
    </div>
  </button>
))}
          </div>
        )}
      </div>
    </div>
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

  // Check for retake and ID format before starting quiz
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

  // Fetch and randomize questions/options
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

  // Timer logic
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

  // Save result when quiz is finished
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

  // UI for entering student ID
  if (!idEntered) {
    return (
      <div>
        <h4>Enter your Matric Number / Student ID to start the quiz</h4>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="e.g. BTH/123456"
          style={{ padding: 8, width: "70%", marginBottom: 12 }}
        />
        <br />
        <button
          onClick={handleStartQuiz}
          disabled={!studentId || checkingRetake}
          style={{
            background: "#4f8cff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "0.5rem 1.2rem",
            fontWeight: "bold",
            cursor: !studentId || checkingRetake ? "not-allowed" : "pointer",
          }}
        >
          {checkingRetake ? "Checking..." : "Start Quiz"}
        </button>
        <button
          onClick={onBack}
          style={{
            marginLeft: 12,
            background: "#e3eafc",
            color: "#2d3e50",
            border: "none",
            borderRadius: 6,
            padding: "0.5rem 1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
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
      <div>
        <h4>Quiz Complete!</h4>
        <p>
          You scored {score} out of {questions.length}
        </p>
        {saving ? (
          <p>Saving your result...</p>
        ) : (
          <button onClick={onBack} style={{
            background: "#4f8cff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "0.5rem 1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}>Back to Quizzes</button>
        )}
      </div>
    );

  const q = questions[current];

  return (
    <div>
      {timerSeconds > 0 && !showResult && (
        <div style={{ fontWeight: "bold", color: "#4f8cff", marginBottom: 12 }}>
          Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </div>
      )}
      <h4>
        Question {current + 1} of {questions.length}
      </h4>
      <p style={{ fontWeight: "bold" }}>{q.question_text}</p>
      <ul style={{ paddingLeft: 0, margin: 0 }}>
        {q.options.map((opt, idx) => (
          <li
            key={idx}
            onClick={() => handleAnswer(idx)}
            style={{
              display: "flex",
              alignItems: "center",
              background: answers[current] === idx ? "#e6f0ff" : "#fff",
              border: answers[current] === idx ? "2px solid #4f8cff" : "1px solid #dbeafe",
              borderRadius: 8,
              padding: "0.75rem 1.25rem",
              marginBottom: 14,
              cursor: "pointer",
              boxShadow: answers[current] === idx ? "0 2px 8px #4f8cff22" : "none",
              transition: "background 0.2s, border 0.2s, box-shadow 0.2s",
              fontWeight: answers[current] === idx ? "bold" : "normal",
              fontSize: "1.08rem",
              userSelect: "none",
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
                width: 20,
                height: 20,
                cursor: "pointer",
              }}
              tabIndex={-1}
            />
            <span>{opt}</span>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 16 }}>
        <button onClick={handlePrev} disabled={current === 0} style={{
          marginRight: 8,
          background: "#e3eafc",
          color: "#2d3e50",
          border: "none",
          borderRadius: 6,
          padding: "0.5rem 1.2rem",
          fontWeight: "bold",
          cursor: current === 0 ? "not-allowed" : "pointer",
        }}>
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
            padding: "0.5rem 1.2rem",
            fontWeight: "bold",
            cursor: answers[current] === -1 ? "not-allowed" : "pointer",
          }}
        >
          {current === questions.length - 1 ? "Finish" : "Next"}
        </button>
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

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("courses").select("*");
      if (!error && data) setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  // Fetch notes for selected course
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

  // Fetch quizzes for selected course
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

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: `url("https://images.unsplash.com/photo-1740635341299-3b8e3490f546?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") center center / cover no-repeat fixed`,
          padding: 0,
          margin: 0,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "2rem auto",
            background: "rgba(231, 187, 187, 0.75)", // more transparent
            borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(50, 126, 203, 0.51)",
            padding: "2rem",
          }}
        >
          <h2 style={{ fontWeight: 900, color: "#2d3e50" }}>Welcome to your e-Classroom</h2>
          <p>Select a course to download notes and take quizzes:</p>
          <div style={{ display: "flex", gap: "2rem" }}>
            <aside style={{ minWidth: "200px" }}>
              {loading ? (
                <p>Loading courses...</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {courses.map((course) => (
                    <li key={course.id} style={{ marginBottom: "1rem" }}>
                      <button
                        style={{
                          background:
                            selectedCourse === course.id ? "#4f8cff" : "#e3eafc",
                          color: selectedCourse === course.id ? "#fff" : "#2d3e50",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.75rem 1.5rem",
                          cursor: "pointer",
                          width: "100%",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        {course.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
            <main
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.55)", // transparent white
                borderRadius: "12px",
                padding: "2rem",
                boxShadow: "0 2px 16px rgba(44,62,80,0.08)",
                minHeight: 400,
                position: "relative",
              }}
            >
              {selectedCourse ? (
                <>
                  <StudentPanel
                    notes={notes}
                    quizzes={quizzes}
                    onQuizClick={quiz => setSelectedQuiz(quiz)}
                  />
                  {selectedQuiz && (
                    <div style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      background: "#0008",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1000
                    }}>
                      <div style={{
                        background: "rgba(255,255,255,0.85)", // transparent white
                        borderRadius: 12,
                        padding: 32,
                        minWidth: 350,
                        maxWidth: 600,
                        boxShadow: "0 4px 24px rgba(44,62,80,0.15)"
                      }}>
                        <QuizTaker quiz={selectedQuiz} onBack={() => setSelectedQuiz(null)} />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p>Please select a course to view and download notes.</p>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentPage;