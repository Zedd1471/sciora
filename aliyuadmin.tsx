import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import Papa from "papaparse";

type Course = { id: string; name: string };
type Note = { id: string; title: string; week: number; file_url: string; course_id: string };
type Quiz = { id: string; title: string; week: number; course_id: string; num_questions?: number; timer_seconds?: number };
type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_option: number;
  quiz_id: string;
};
type QuizResult = {
  id: string;
  quiz_id: string;
  student_id: string;
  score: number;
  total: number;
  taken_at: string;
};

function exportResultsAsCSV(results: QuizResult[]) {
  if (!results || results.length === 0) return;
  const header = "Student ID,Score,Total,Date\n";
  const rows = results
    .map(
      (r) =>
        `${r.student_id},${r.score},${r.total},${new Date(r.taken_at).toLocaleString()}`
    )
    .join("\n");
  const csv = header + rows;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quiz_results.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const AdminPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [title, setTitle] = useState("");
  const [week, setWeek] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [courseMessage, setCourseMessage] = useState("");

  // Quiz management state
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizWeek, setQuizWeek] = useState<number>(1);
  const [quizCourseId, setQuizCourseId] = useState("");
  const [quizMsg, setQuizMsg] = useState("");
  const [quizNumQuestions, setQuizNumQuestions] = useState<number>(1);
  const [quizTimerMinutes, setQuizTimerMinutes] = useState<number>(0);

  // Question management state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [questionMsg, setQuestionMsg] = useState("");

  // Results state
  const [resultsQuiz, setResultsQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);

  // Fetch courses and notes
  useEffect(() => {
    fetchCourses();
    fetchNotes();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*");
    if (data) setCourses(data);
  };

  const fetchNotes = async () => {
    const { data } = await supabase.from("notes").select("*");
    if (data) setNotes(data);
  };

  // Add new course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCourseMessage("");
    if (!courseId || !courseName) {
      setCourseMessage("Please enter both course ID and name.");
      return;
    }
    const { error } = await supabase.from("courses").insert([
      { id: courseId, name: courseName },
    ]);
    if (error) {
      setCourseMessage("Failed to add course: " + error.message);
    } else {
      setCourseMessage("Course added successfully!");
      setCourseId("");
      setCourseName("");
      fetchCourses();
    }
  };

  // Delete course
  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course? All related notes will also be deleted.")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) {
      alert("Failed to delete course: " + error.message);
    } else {
      fetchCourses();
      fetchNotes();
    }
  };

  // Upload note
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!courseId || !title || !file) {
      setMessage("Please fill all fields and select a file.");
      return;
    }
    const filePath = `${courseId}/${week}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("lecture-notes")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      setMessage("File upload failed: " + uploadError.message);
      return;
    }
    const { data: publicUrlData } = supabase.storage
      .from("lecture-notes")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("notes").insert([
      {
        course_id: courseId,
        title,
        file_url: publicUrlData.publicUrl,
        week,
      },
    ]);
    if (insertError) {
      setMessage("Database insert failed: " + insertError.message);
      return;
    }
    setMessage("Note uploaded successfully!");
    setTitle("");
    setFile(null);
    setWeek(1);
    fetchNotes();
  };

  // Delete note
  const handleDeleteNote = async (id: string, file_url: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    // Delete from storage
    const path = file_url.split("/lecture-notes/")[1];
    if (path) {
      await supabase.storage.from("lecture-notes").remove([path]);
    }
    // Delete from database
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      alert("Failed to delete note: " + error.message);
    } else {
      fetchNotes();
    }
  };

  // Fetch quizzes for selected course
  useEffect(() => {
    if (quizCourseId) fetchQuizzes();
  }, [quizCourseId]);

  const fetchQuizzes = async () => {
    const { data } = await supabase
      .from("quizzes")
      .select("*")
      .eq("course_id", quizCourseId)
      .order("week", { ascending: true });
    if (data) setQuizzes(data);
  };

  // Fetch results for selected quiz
  useEffect(() => {
    if (resultsQuiz) {
      supabase
        .from("quiz_results")
        .select("*")
        .eq("quiz_id", resultsQuiz.id)
        .then(({ data }) => {
          if (data) setResults(data);
        });
    }
  }, [resultsQuiz]);

  // Add quiz
  const handleAddQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuizMsg("");
    if (!quizCourseId || !quizTitle) {
      setQuizMsg("Select course and enter quiz title.");
      return;
    }
    const { error } = await supabase.from("quizzes").insert([
      {
        course_id: quizCourseId,
        title: quizTitle,
        week: quizWeek,
        num_questions: quizNumQuestions,
        timer_seconds: quizTimerMinutes * 60,
      },
    ]);
    if (error) setQuizMsg("Failed: " + error.message);
    else {
      setQuizMsg("Quiz added!");
      setQuizTitle("");
      setQuizWeek(1);
      setQuizNumQuestions(1);
      setQuizTimerMinutes(0);
      fetchQuizzes();
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (id: string) => {
    if (!window.confirm("Delete this quiz and all its questions?")) return;
    await supabase.from("quizzes").delete().eq("id", id);
    setSelectedQuiz(null);
    fetchQuizzes();
    setQuestions([]);
  };

  // Fetch questions for selected quiz
  useEffect(() => {
    if (selectedQuiz) fetchQuestions(selectedQuiz.id);
  }, [selectedQuiz]);

  const fetchQuestions = async (quizId: string) => {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quizId);
    if (data) setQuestions(data);
  };

  // Add question manually
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuestionMsg("");
    if (!selectedQuiz) return;
    if (
      !questionText ||
      options.some((opt) => !opt) ||
      correctOption < 0 ||
      correctOption > 3
    ) {
      setQuestionMsg("Fill all fields and options.");
      return;
    }
    const { error } = await supabase.from("questions").insert([
      {
        quiz_id: selectedQuiz.id,
        question_text: questionText,
        options,
        correct_option: correctOption,
      },
    ]);
    if (error) setQuestionMsg("Failed: " + error.message);
    else {
      setQuestionMsg("Question added!");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectOption(0);
      fetchQuestions(selectedQuiz.id);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (id: string) => {
    await supabase.from("questions").delete().eq("id", id);
    if (selectedQuiz) fetchQuestions(selectedQuiz.id);
  };

  // CSV upload handler
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedQuiz) return;
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const rows = results.data as any[];
        const formatted = rows
          .filter(
            (row) =>
              row.question_text &&
              row.option_a &&
              row.option_b &&
              row.option_c &&
              row.option_d &&
              row.correct_option
          )
          .map((row) => ({
            quiz_id: selectedQuiz.id,
            question_text: row.question_text,
            options: [row.option_a, row.option_b, row.option_c, row.option_d],
            correct_option: ["A", "B", "C", "D"].indexOf(
              row.correct_option.trim().toUpperCase()
            ),
          }))
          .filter((q) => q.correct_option !== -1);

        if (formatted.length === 0) {
          setQuestionMsg("No valid questions found in CSV.");
          return;
        }

        const { error } = await supabase.from("questions").insert(formatted);
        if (error) setQuestionMsg("CSV upload failed: " + error.message);
        else {
          setQuestionMsg(`Uploaded ${formatted.length} questions!`);
          fetchQuestions(selectedQuiz.id);
        }
      },
      error: () => setQuestionMsg("Failed to parse CSV."),
    });
  };

  return (
    <div style={{
      maxWidth: "1000px",
      margin: "2rem auto",
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(44,62,80,0.10)",
      padding: "2rem"
    }}>
      <h2>Admin Portal</h2>
      <form onSubmit={handleAddCourse} style={{ maxWidth: 400, marginBottom: 32 }}>
        <h3>Add New Course</h3>
        <label>
          Course ID:
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          Course Name:
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <button
          type="submit"
          style={{
            marginTop: 12,
            background: "#4f8cff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "0.75rem 2rem",
            fontWeight: "bold",
            cursor: "pointer",
            marginRight: "1rem"
          }}
        >
          Add Course
        </button>
        {courseMessage && <p style={{ color: courseMessage.includes("success") ? "green" : "red" }}>{courseMessage}</p>}
      </form>

      <div style={{ marginBottom: 32 }}>
        <h3>Existing Courses</h3>
        <ul>
          {courses.map((course) => (
            <li key={course.id} style={{ marginBottom: 8 }}>
              <b>{course.id}</b> - {course.name}{" "}
              <button
                style={{
                  marginLeft: 12,
                  background: "#ff4f4f",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "0.5rem 1.2rem",
                  cursor: "pointer"
                }}
                onClick={() => handleDeleteCourse(course.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleUpload} style={{ maxWidth: 400 }}>
        <h3>Upload Lecture Note</h3>
        <label>
          Course:
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Note Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          Week:
          <input
            type="number"
            value={week}
            min={1}
            onChange={(e) => setWeek(Number(e.target.value))}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <label>
          File (PDF/Word):
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            style={{ width: "100%", marginBottom: 8 }}
          />
        </label>
        <button
          type="submit"
          style={{
            marginTop: 12,
            background: "#4f8cff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "0.75rem 2rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Upload Note
        </button>
        {message && <p style={{ color: message.includes("success") ? "green" : "red" }}>{message}</p>}
      </form>

      <div style={{ marginTop: 32 }}>
        <h3>Uploaded Notes</h3>
        <ul>
          {notes.map((note) => (
            <li key={note.id} style={{ marginBottom: 8 }}>
              <b>{note.title}</b> (Course: {note.course_id}, Week: {note.week}){" "}
              <a href={note.file_url} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>
                [Download]
              </a>
              <button
                style={{
                  background: "#ff4f4f",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "0.5rem 1.2rem",
                  cursor: "pointer"
                }}
                onClick={() => handleDeleteNote(note.id, note.file_url)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3 style={{ borderLeft: "6px solid #4f8cff", paddingLeft: "0.75rem" }}>
          Quiz Management
        </h3>
        <form onSubmit={handleAddQuiz} style={{ maxWidth: 400, marginBottom: 24 }}>
          <label>
            Course:
            <select
              value={quizCourseId}
              onChange={(e) => setQuizCourseId(e.target.value)}
              required
              style={{ width: "100%", marginBottom: 8 }}
            >
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Quiz Title:
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              required
              style={{ width: "100%", marginBottom: 8 }}
            />
          </label>
          <label>
            Week:
            <input
              type="number"
              value={quizWeek}
              min={1}
              onChange={(e) => setQuizWeek(Number(e.target.value))}
              required
              style={{ width: "100%", marginBottom: 8 }}
            />
          </label>
          <label>
            Number of Questions:
            <input
              type="number"
              value={quizNumQuestions}
              min={1}
              onChange={(e) => setQuizNumQuestions(Number(e.target.value))}
              required
              style={{ width: "100%", marginBottom: 8 }}
            />
          </label>
          <label>
            Timer (minutes, 0 for no timer):
            <input
              type="number"
              value={quizTimerMinutes}
              min={0}
              onChange={(e) => setQuizTimerMinutes(Number(e.target.value))}
              required
              style={{ width: "100%", marginBottom: 8 }}
            />
          </label>
          <button
            type="submit"
            style={{
              marginTop: 12,
              background: "#4f8cff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "0.75rem 2rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Add Quiz
          </button>
          {quizMsg && (
            <p style={{ color: quizMsg.includes("add") ? "green" : "red" }}>{quizMsg}</p>
          )}
        </form>

        {/* List quizzes */}
        {quizCourseId && (
          <div style={{ marginBottom: 24 }}>
            <h4>Quizzes for this course:</h4>
            <ul>
              {quizzes.map((quiz) => (
                <li key={quiz.id} style={{ marginBottom: 8 }}>
                  <b>
                    {quiz.title} (Week {quiz.week})
                  </b>{" "}
                  <button
                    style={{
                      marginLeft: 8,
                      background: "#4f8cff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "0.25rem 1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedQuiz(quiz)}
                  >
                    Manage Questions
                  </button>
                  <button
                    style={{
                      marginLeft: 8,
                      background: "#ff4f4f",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "0.25rem 1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    Delete Quiz
                  </button>
                  <button
                    style={{
                      marginLeft: 8,
                      background: "#4f8cff",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "0.25rem 1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => setResultsQuiz(quiz)}
                  >
                    View Results
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Results Table and Export */}
        {resultsQuiz && (
          <div style={{ marginTop: 24 }}>
            <h4>
              Results for: {resultsQuiz.title} (Week {resultsQuiz.week})
            </h4>
            <button
              style={{
                background: "#e3eafc",
                color: "#2d3e50",
                border: "none",
                borderRadius: 6,
                padding: "0.5rem 1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: 12,
              }}
              onClick={() => setResultsQuiz(null)}
            >
              Back to Quizzes
            </button>
            <button
              style={{
                marginLeft: 8,
                background: "#4f8cff",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "0.5rem 1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: 12,
              }}
              onClick={() => exportResultsAsCSV(results)}
            >
              Export as CSV
            </button>
            <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: 4 }}>Student ID</th>
                  <th style={{ border: "1px solid #ccc", padding: 4 }}>Score</th>
                  <th style={{ border: "1px solid #ccc", padding: 4 }}>Total</th>
                  <th style={{ border: "1px solid #ccc", padding: 4 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td style={{ border: "1px solid #ccc", padding: 4 }}>{r.student_id}</td>
                    <td style={{ border: "1px solid #ccc", padding: 4 }}>{r.score}</td>
                    <td style={{ border: "1px solid #ccc", padding: 4 }}>{r.total}</td>
                    <td style={{ border: "1px solid #ccc", padding: 4 }}>{new Date(r.taken_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Manage questions for selected quiz */}
        {selectedQuiz && (
          <div style={{ marginTop: 24, marginBottom: 24 }}>
            <h4>
              Questions for: {selectedQuiz.title} (Week {selectedQuiz.week})
            </h4>

            {/* CSV Upload */}
            <div style={{ margin: "1rem 0" }}>
              <label>
                <b>Upload Questions from CSV:</b>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  style={{ display: "block", marginTop: 8 }}
                />
              </label>
              <small>
                Format: question_text, option_a, option_b, option_c, option_d, correct_option (A/B/C/D)
              </small>
            </div>

            {/* Manual Add */}
            <form onSubmit={handleAddQuestion} style={{ maxWidth: 400, marginBottom: 16 }}>
              <label>
                Question:
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  style={{ width: "100%", marginBottom: 8 }}
                />
              </label>
              {options.map((opt, idx) => (
                <label key={idx}>
                  Option {String.fromCharCode(65 + idx)}:
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[idx] = e.target.value;
                      setOptions(newOpts);
                    }}
                    required
                    style={{ width: "100%", marginBottom: 8 }}
                  />
                </label>
              ))}
              <label>
                Correct Option:
                <select
                  value={correctOption}
                  onChange={(e) => setCorrectOption(Number(e.target.value))}
                  style={{ width: "100%", marginBottom: 8 }}
                >
                  {options.map((_, idx) => (
                    <option key={idx} value={idx}>
                      {String.fromCharCode(65 + idx)}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                style={{
                  marginTop: 12,
                  background: "#4f8cff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.75rem 2rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Add Question
              </button>
              {questionMsg && (
                <p style={{ color: questionMsg.includes("add") || questionMsg.includes("Uploaded") ? "green" : "red" }}>{questionMsg}</p>
              )}
            </form>
            <ul>
              {questions.map((q, idx) => (
                <li key={q.id} style={{ marginBottom: 8 }}>
                  <b>Q{idx + 1}:</b> {q.question_text}
                  <ul>
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        style={{
                          fontWeight: i === q.correct_option ? "bold" : "normal",
                          color: i === q.correct_option ? "#4f8cff" : "#2d3e50",
                        }}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </li>
                    ))}
                  </ul>
                  <button
                    style={{
                      background: "#ff4f4f",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "0.25rem 1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDeleteQuestion(q.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <button
              style={{
                marginTop: 12,
                background: "#e3eafc",
                color: "#2d3e50",
                border: "none",
                borderRadius: 6,
                padding: "0.5rem 1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => setSelectedQuiz(null)}
            >
              Back to Quizzes
            </button>
          </div>
        )}
      </div>

      <h3 style={{
  borderLeft: "6px solid #4f8cff",
  paddingLeft: "0.75rem",
  marginTop: "2rem",
  marginBottom: "1rem"
}}>
  Section Title
</h3>
    </div>
  );
};

export default AdminPage;