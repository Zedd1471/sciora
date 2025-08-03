import React, { useEffect, useState } from "react";
import * as quizService from '../services/quizService';
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Papa from "papaparse";
import styled, { keyframes } from "styled-components";
import BlogPostForm from './BlogPostForm';
import FeedbackManager from './FeedbackManager';
import BlogManager from './BlogManager';

// Define types
type Course = { id: string; name: string };
type Note = { id: string; title: string; week: number; file_url: string; course_id: string };
type Quiz = { id: string; title: string; week: number; course_id: string; num_questions?: number; timer_seconds?: number; is_enabled: boolean; valid_from?: string; valid_to?: string; };
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

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.h2`
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #e0e6ed;
  text-align: center;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: #f0f4f8;
  border-radius: 10px;
  padding: 0.5rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.8rem 1.8rem;
  background: ${({ $active }) => $active ? "#4f8cff" : "transparent"};
  color: ${({ $active }) => $active ? "#fff" : "#5a6a7a"};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  flex-grow: 1;
  text-align: center;

  &:hover {
    background: ${({ $active }) => $active ? "#3a7bff" : "#e0e6ed"};
    color: ${({ $active }) => $active ? "#fff" : "#2c3e50"};
  }
`;

const Section = styled.div`
  background: #fdfdfd;
  border: 1px solid #e0e6ed;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
`;

const SectionTitle = styled.h3`
  font-size: 1.6rem;
  color: #34495e;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #e0e6ed;
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 600;
  color: #4a5a6a;
  font-size: 0.95rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.9rem 1.2rem;
  border: 1px solid #cdd5df;
  border-radius: 8px;
  font-size: 1rem;
  color: #34495e;
  background: #ffffff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4f8cff;
    box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.2);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.9rem 1.2rem;
  border: 1px solid #cdd5df;
  border-radius: 8px;
  font-size: 1rem;
  color: #34495e;
  background: #ffffff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4f8cff;
    box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: #4f8cff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.05rem;
  width: 100%;
  margin-top: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(79, 140, 255, 0.2);

  &:hover {
    background: #3a7bff;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(79, 140, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ActionButton = styled.button<{ $color?: string }>`
  background: ${({ $color }) => $color || "#4f8cff"};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const DeleteButton = styled(ActionButton)`
  background: #ff4f4f;

  &:hover {
    background: #e53e3e;
  }
`;

const DownloadButton = styled(ActionButton)`
  background: #28a745; /* Green for download */

  &:hover {
    background: #218838;
  }
`;

const Message = styled.div<{ $success: boolean }>`
  color: ${({ $success }) => $success ? "#28a745" : "#dc3545"};
  margin-top: 1.5rem;
  padding: 1rem;
  background: ${({ $success }) => $success ? "rgba(40, 167, 69, 0.08)" : "rgba(220, 53, 69, 0.08)"};
  border-radius: 8px;
  border: 1px solid ${({ $success }) => $success ? "#28a745" : "#dc3545"};
  font-size: 0.95rem;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1rem;
  border-bottom: 1px solid #e0e6ed;
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #e0e6ed;
  font-weight: 700;
  color: #4a5a6a;
  background: #f8f9fa;
`;

const TableCell = styled.td`
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  color: #34495e;
`;

const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const QuizCard = styled.div`
  background: #ffffff;
  border: 1px solid #e0e6ed;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

const QuestionContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e0e6ed;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

// Admin Dashboard Component (all admin functionality)
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };
const [activeTab, setActiveTab] = useState<'courses' | 'notes' | 'quizzes' | 'results' | 'blog' | 'feedback'>('courses');
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
  const [quizValidFrom, setQuizValidFrom] = useState<string>('');
  const [quizValidTo, setQuizValidTo] = useState<string>('');

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
    if (!window.confirm(`Are you sure you want to delete this note? (ID: ${id})`)) return;

    console.log(`Attempting to delete note with ID: ${id} and file URL: ${file_url}`);

    try {
      // 1. Extract path from the URL
      const url = new URL(file_url);
      const path = url.pathname.substring(url.pathname.indexOf('/lecture-notes/') + '/lecture-notes/'.length);

      if (!path) {
        throw new Error("Could not extract file path from URL.");
      }
      console.log(`Extracted storage path: ${path}`);

      // 2. Delete file from storage first
      const { error: storageError } = await supabase.storage
        .from("lecture-notes")
        .remove([path]);

      if (storageError) {
        console.error("Storage deletion warning:", storageError.message);
      }

      // 3. Delete record from the database and get the deleted row back
      const { data: deletedData, error: dbError } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .select();

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      if (!deletedData || deletedData.length === 0) {
        throw new Error("No record was deleted from the database. Please check RLS policies or if the note was already deleted.");
      }

      console.log("Successfully deleted record from database:", deletedData);

      // 4. Update UI state on success
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      alert("Note deleted successfully!");

    } catch (error: any) {
      alert(`Deletion failed: ${error.message}`);
      console.error("Full deletion error:", error);
    }
  };

  // Fetch quizzes for selected course
  useEffect(() => {
    if (quizCourseId) fetchQuizzes();
  }, [quizCourseId]);

  const getQuizStatus = (quiz: Quiz): string => {
    const now = new Date();
    const validFromDate = quiz.valid_from ? new Date(quiz.valid_from) : null;
    const validToDate = quiz.valid_to ? new Date(quiz.valid_to) : null;

    if (validFromDate && now < validFromDate) {
      return `Upcoming (Starts: ${validFromDate.toLocaleDateString()})`;
    }
    if (validToDate && now > validToDate) {
      return `Expired (Ended: ${validToDate.toLocaleDateString()})`;
    }
    if (quiz.is_enabled) {
      return "Active";
    }
    return "Disabled";
  };

  const fetchQuizzes = async () => {
    const data = await quizService.fetchQuizzes(quizCourseId);
    setQuizzes(data);
  };

  const handleToggleQuiz = async (id: string, is_enabled: boolean, valid_from?: string, valid_to?: string) => {
    const now = new Date();
    const validFromDate = valid_from ? new Date(valid_from) : null;
    const validToDate = valid_to ? new Date(valid_to) : null;

    if (!is_enabled && validFromDate && now < validFromDate) {
      alert("Cannot enable an upcoming quiz before its start date.");
      return;
    }
    if (!is_enabled && validToDate && now > validToDate) {
      alert("Cannot enable an expired quiz.");
      return;
    }

    const { error } = await quizService.toggleQuizStatus(id, is_enabled);

    if (error) {
      alert("Failed to update quiz status: " + error.message);
    } else {
      fetchQuizzes();
    }
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
    const { error } = await quizService.addQuiz({
      course_id: quizCourseId,
      title: quizTitle,
      week: quizWeek,
      num_questions: quizNumQuestions,
      timer_seconds: quizTimerMinutes * 60,
      valid_from: quizValidFrom || null,
      valid_to: quizValidTo || null,
    });
    if (error) setQuizMsg("Failed: " + error.message);
    else {
      setQuizMsg("Quiz added!");
      setQuizTitle("");
      setQuizWeek(1);
      setQuizNumQuestions(1);
      setQuizTimerMinutes(0);
      setQuizValidFrom('');
      setQuizValidTo('');
      fetchQuizzes();
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (id: string) => {
    if (!window.confirm("Delete this quiz and all its questions?")) return;
    const { error } = await quizService.deleteQuiz(id);
    if (error) {
      alert("Failed to delete quiz: " + error.message);
    } else {
      setSelectedQuiz(null);
      fetchQuizzes();
      setQuestions([]);
    }
  };

  // Fetch questions for selected quiz
  useEffect(() => {
    if (selectedQuiz) fetchQuestions(selectedQuiz.id);
  }, [selectedQuiz]);

  const fetchQuestions = async (quizId: string) => {
    const data = await quizService.fetchQuestions(quizId);
    setQuestions(data);
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
    const { error } = await quizService.addQuestion({
      quiz_id: selectedQuiz.id,
      question_text: questionText,
      options,
      correct_option: correctOption,
    });
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
    const { error } = await quizService.deleteQuestion(id);
    if (error) {
      alert("Failed to delete question: " + error.message);
    } else {
      if (selectedQuiz) fetchQuestions(selectedQuiz.id);
    }
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

  const exportCumulativeResults = async (courseId: string) => {
    // 1. Fetch all quizzes for the course
    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('id, title')
      .eq('course_id', courseId);

    if (quizzesError) {
      alert('Error fetching quizzes.');
      return;
    }

    // 2. Fetch all results for these quizzes
    const quizIds = quizzes.map(q => q.id);
    const { data: results, error: resultsError } = await supabase
      .from('quiz_results')
      .select('student_id, quiz_id, score')
      .in('quiz_id', quizIds);

    if (resultsError) {
      alert('Error fetching results.');
      return;
    }

    // 3. Process the data
    const studentScores: { [key: string]: { [key: string]: number } } = {};
    results.forEach(r => {
      if (!studentScores[r.student_id]) {
        studentScores[r.student_id] = {};
      }
      studentScores[r.student_id][r.quiz_id] = r.score;
    });

    // 4. Generate CSV
    const headers = ['Student ID', ...quizzes.map(q => q.title), 'Total'];
    const rows = Object.keys(studentScores).map(studentId => {
      const row = [studentId];
      let total = 0;
      quizzes.forEach(q => {
        const score = studentScores[studentId][q.id] || 0;
        row.push(score.toString());
        total += score;
      });
      row.push(total.toString());
      return row.join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${courseId}_cumulative_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageContainer>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Header>Admin Portal</Header>
        <ActionButton 
          $color="#6c757d"
          onClick={handleLogout}
          style={{ marginBottom: "1rem" }}
        >
          Logout
        </ActionButton>
      </div>
      
      {/* Tab Navigation */}
      <TabContainer>
        <TabButton 
          $active={activeTab === 'courses'} 
          onClick={() => setActiveTab('courses')}
        >
          Courses
        </TabButton>
        <TabButton 
          $active={activeTab === 'notes'} 
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </TabButton>
        <TabButton 
          $active={activeTab === 'quizzes'} 
          onClick={() => setActiveTab('quizzes')}
        >
          Quizzes
        </TabButton>
        <TabButton 
          $active={activeTab === 'results'} 
          onClick={() => setActiveTab('results')}
        >
          Results
        </TabButton>
              <TabButton 
        $active={activeTab === 'blog'} 
        onClick={() => setActiveTab('blog')}
      >
        Blog
      </TabButton>
      <TabButton 
        $active={activeTab === 'feedback'} 
        onClick={() => setActiveTab('feedback')}
      >
        Feedback
      </TabButton>

      </TabContainer>


      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div>
          <ResponsiveGrid>
            {/* Add Course Form */}
            <Section>
              <SectionTitle>Add New Course</SectionTitle>
              <form onSubmit={handleAddCourse}>
                <FormGroup>
                  <FormLabel>Course ID:</FormLabel>
                  <FormInput
                    type="text"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Course Name:</FormLabel>
                  <FormInput
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                  />
                </FormGroup>
                <SubmitButton>Add Course</SubmitButton>
                {courseMessage && (
                  <Message $success={courseMessage.includes("success")}>
                    {courseMessage}
                  </Message>
                )}
              </form>
            </Section>
            
            {/* Existing Courses */}
            <Section>
              <SectionTitle>Existing Courses</SectionTitle>
              {courses.length > 0 ? (
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {courses.map((course) => (
                    <ListItem key={course.id}>
                      <div>
                        <strong>{course.id}</strong> - {course.name}
                      </div>
                      <DeleteButton onClick={() => handleDeleteCourse(course.id)}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </DeleteButton>
                    </ListItem>
                  ))}
                </div>
              ) : (
                <p>No courses available</p>
              )}
            </Section>
          </ResponsiveGrid>
        </div>
      )}
      
      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div>
          <ResponsiveGrid>
            {/* Upload Note Form */}
            <Section>
              <SectionTitle>Upload Lecture Note</SectionTitle>
              <form onSubmit={handleUpload}>
                <FormGroup>
                  <FormLabel>Course:</FormLabel>
                  <FormSelect
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    required
                  >
                    <option value="">Select course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Note Title:</FormLabel>
                  <FormInput
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Week:</FormLabel>
                  <FormInput
                    type="number"
                    value={week}
                    onChange={(e) => setWeek(Number(e.target.value))}
                    min={1}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>File (PDF/Word):</FormLabel>
                  <FormInput
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                  />
                </FormGroup>
                <SubmitButton>Upload Note</SubmitButton>
                {message && (
                  <Message $success={message.includes("success")}>
                    {message}
                  </Message>
                )}
              </form>
            </Section>
            
            {/* Uploaded Notes */}
            <Section>
              <SectionTitle>Uploaded Notes</SectionTitle>
              {notes.length > 0 ? (
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {notes.map((note) => (
                    <ListItem key={note.id}>
                      <div>
                        <strong>{note.title}</strong>
                        <div style={{ fontSize: "0.9rem", color: "#666" }}>
                          Course: {note.course_id}, Week: {note.week}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="download-button">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                        <DeleteButton onClick={() => handleDeleteNote(note.id, note.file_url)}>
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </DeleteButton>
                      </div>
                    </ListItem>
                  ))}
                </div>
              ) : (
                <p>No notes uploaded yet</p>
              )}
            </Section>
          </ResponsiveGrid>
        </div>
      )}
      
      {/* Quizzes Tab */}
      {activeTab === 'quizzes' && (
        <div>
          {!selectedQuiz ? (
            <ResponsiveGrid>
              {/* Add Quiz Form */}
              <Section>
                <SectionTitle>Add New Quiz</SectionTitle>
                <form onSubmit={handleAddQuiz}>
                  <FormGroup>
                    <FormLabel>Course:</FormLabel>
                    <FormSelect
                      value={quizCourseId}
                      onChange={(e) => setQuizCourseId(e.target.value)}
                      required
                    >
                      <option value="">Select course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </FormSelect>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Quiz Title:</FormLabel>
                    <FormInput
                      type="text"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Week:</FormLabel>
                    <FormInput
                      type="number"
                      value={quizWeek}
                      onChange={(e) => setQuizWeek(Number(e.target.value))}
                      min={1}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Number of Questions:</FormLabel>
                    <FormInput
                      type="number"
                      value={quizNumQuestions}
                      onChange={(e) => setQuizNumQuestions(Number(e.target.value))}
                      min={1}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Timer (minutes, 0 for no timer):</FormLabel>
                    <FormInput
                      type="number"
                      value={quizTimerMinutes}
                      onChange={(e) => setQuizTimerMinutes(Number(e.target.value))}
                      min={0}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Valid From:</FormLabel>
                    <FormInput
                      type="date"
                      value={quizValidFrom}
                      onChange={(e) => setQuizValidFrom(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Valid To:</FormLabel>
                    <FormInput
                      type="date"
                      value={quizValidTo}
                      onChange={(e) => setQuizValidTo(e.target.value)}
                    />
                  </FormGroup>
                  <SubmitButton>Add Quiz</SubmitButton>
                  {quizMsg && (
                    <Message $success={quizMsg.includes("add")}>
                      {quizMsg}
                    </Message>
                  )}
                </form>
              </Section>
              
              {/* Quiz List */}
              <Section>
                <SectionTitle>Quizzes</SectionTitle>
                {quizzes.length > 0 ? (
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {quizzes.map((quiz) => (
                      <ListItem key={quiz.id}>
                        <div>
                          <strong>{quiz.title}</strong>
                          <div style={{ fontSize: "0.9rem", color: "#666" }}>
                            Week {quiz.week} | {quiz.num_questions || 0} questions
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "5px" }}>
                            Status: {getQuizStatus(quiz)}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <ActionButton 
                            $color={quiz.is_enabled ? "#ffc107" : "#28a745"}
                            onClick={() => handleToggleQuiz(quiz.id, quiz.is_enabled, quiz.valid_from, quiz.valid_to)}
                          >
                            {quiz.is_enabled ? "Disable" : "Enable"}
                          </ActionButton>
                          <ActionButton 
                            $color="#4f8cff"
                            onClick={() => setSelectedQuiz(quiz)}
                          >
                            Manage
                          </ActionButton>
                          <ActionButton 
                            $color="#4f8cff"
                            onClick={() => setResultsQuiz(quiz)}
                          >
                            Results
                          </ActionButton>
                          <DeleteButton onClick={() => handleDeleteQuiz(quiz.id)}>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </DeleteButton>
                        </div>
                      </ListItem>
                    ))}
                  </div>
                ) : (
                  <p>No quizzes created yet</p>
                )}
              </Section>
            </ResponsiveGrid>
          ) : (
            <div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "1.5rem"
              }}>
                <h3>Questions for: {selectedQuiz.title} (Week {selectedQuiz.week})</h3>
                <ActionButton 
                  $color="#6c757d"
                  onClick={() => setSelectedQuiz(null)}
                >
                  ← Back to Quizzes
                </ActionButton>
              </div>
              
              <ResponsiveGrid>
                {/* Add Questions */}
                <div>
                  <Section>
                    <SectionTitle>Add Questions</SectionTitle>
                    <form onSubmit={handleAddQuestion}>
                      <FormGroup>
                        <FormLabel>Question:</FormLabel>
                        <FormInput
                          type="text"
                          value={questionText}
                          onChange={(e) => setQuestionText(e.target.value)}
                          required
                        />
                      </FormGroup>
                      {options.map((opt, idx) => (
                        <FormGroup key={idx}>
                          <FormLabel>Option {String.fromCharCode(65 + idx)}:</FormLabel>
                          <FormInput
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...options];
                              newOpts[idx] = e.target.value;
                              setOptions(newOpts);
                            }}
                            required
                          />
                        </FormGroup>
                      ))}
                      <FormGroup>
                        <FormLabel>Correct Option:</FormLabel>
                        <FormSelect
                          value={correctOption}
                          onChange={(e) => setCorrectOption(Number(e.target.value))}
                          required
                        >
                          {options.map((_, idx) => (
                            <option key={idx} value={idx}>
                              {String.fromCharCode(65 + idx)}
                            </option>
                          ))}
                        </FormSelect>
                      </FormGroup>
                      <SubmitButton>Add Question</SubmitButton>
                      {questionMsg && (
                        <Message $success={questionMsg.includes("add") || questionMsg.includes("Uploaded")}>
                          {questionMsg}
                        </Message>
                      )}
                    </form>
                  </Section>
                  
                  <Section>
                    <SectionTitle>Upload Questions from CSV</SectionTitle>
                    <FormGroup>
                      <FormLabel>Select CSV File:</FormLabel>
                      <FormInput
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                      />
                    </FormGroup>
                    <p style={{ fontSize: "0.9rem", marginTop: "8px" }}>
                      Format: question_text, option_a, option_b, option_c, option_d, correct_option (A/B/C/D)
                    </p>
                  </Section>
                </div>
                
                {/* Question List */}
                <Section>
                  <SectionTitle>Existing Questions</SectionTitle>
                  {questions.length > 0 ? (
                    <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                      {questions.map((q, idx) => (
                        <QuestionContainer key={q.id}>
                          <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between",
                            marginBottom: "0.5rem"
                          }}>
                            <strong>Q{idx + 1}: {q.question_text}</strong>
                            <DeleteButton onClick={() => handleDeleteQuestion(q.id)}>
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </DeleteButton>
                          </div>
                          <ul style={{ paddingLeft: "1.5rem" }}>
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
                        </QuestionContainer>
                      ))}
                    </div>
                  ) : (
                    <p>No questions added yet</p>
                  )}
                </Section>
              </ResponsiveGrid>
            </div>
          )}
        </div>
      )}
      
      {/* Results Tab */}
      {activeTab === 'results' && (
        <div>
          <Section>
            <SectionTitle>View Results</SectionTitle>
            <FormGroup>
              <FormLabel>Select Course:</FormLabel>
              <FormSelect
                value={quizCourseId}
                onChange={(e) => setQuizCourseId(e.target.value)}
                required
              >
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
            {quizCourseId && (
              <ActionButton
                $color="#17a2b8"
                onClick={() => exportCumulativeResults(quizCourseId)}
              >
                Export Cumulative Results
              </ActionButton>
            )}
          </Section>

          {!resultsQuiz ? (
            <Section>
              <SectionTitle>Select Quiz to View Results</SectionTitle>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                gap: "1rem"
              }}>
                {quizzes.map((quiz) => (
                  <QuizCard key={quiz.id}>
                    <div>
                      <strong>{quiz.title}</strong>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        Week {quiz.week} | {quiz.num_questions || 0} questions
                      </div>
                    </div>
                    <ActionButton 
                      $color="#4f8cff"
                      onClick={() => setResultsQuiz(quiz)}
                    >
                      View Results
                    </ActionButton>
                  </QuizCard>
                ))}
              </div>
            </Section>
          ) : (
            <div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "1.5rem"
              }}>
                <h3>Results for: {resultsQuiz.title} (Week {resultsQuiz.week})</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <ActionButton 
                    $color="#6c757d"
                    onClick={() => setResultsQuiz(null)}
                  >
                    ← Back to Quizzes
                  </ActionButton>
                  <ActionButton 
                    $color="#28a745"
                    onClick={() => exportResultsAsCSV(results)}
                  >
                    Export as CSV
                  </ActionButton>
                </div>
              </div>
              
              {results.length > 0 ? (
                <div style={{ 
                  maxHeight: "500px", 
                  overflowY: "auto",
                  border: "1px solid #eaeaea",
                  borderRadius: "8px"
                }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#f8f9fa", position: "sticky", top: 0 }}>
                      <tr>
                        <TableHeader>Student ID</TableHeader>
                        <TableHeader>Score</TableHeader>
                        <TableHeader>Total</TableHeader>
                        <TableHeader>Date</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r) => (
                        <tr key={r.id}>
                          <TableCell>{r.student_id}</TableCell>
                          <TableCell>{r.score}</TableCell>
                          <TableCell>{r.total}</TableCell>
                          <TableCell>{new Date(r.taken_at).toLocaleString()}</TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No results available for this quiz</p>
              )}
            </div>
          )}
        </div>
      )}
      {activeTab === 'blog' && (
        <Section>
          <SectionTitle>Manage Blog Posts</SectionTitle>
          <BlogPostForm />
          <BlogManager />
        </Section>
      )}
      {activeTab === 'feedback' && (
        <Section>
          <SectionTitle>Manage Student Feedback</SectionTitle>
          <FeedbackManager />
        </Section>
      )}

    </PageContainer>
  );
};

export default AdminDashboard;