import { supabase } from './supabaseClient';

interface Quiz {
  id: string;
  title: string;
  week: number;
  course_id: string;
  num_questions?: number;
  timer_seconds?: number;
  is_enabled: boolean;
  valid_from?: string;
  valid_to?: string;
}

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_option: number;
  quiz_id: string;
}

export const fetchQuizzes = async (courseId: string): Promise<Quiz[]> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, valid_from, valid_to')
    .eq('course_id', courseId)
    .order('week', { ascending: true });

  if (error) {
    console.error('Error fetching quizzes:', error.message);
    return [];
  }
  return data as Quiz[];
};

export const addQuiz = async (quiz: Omit<Quiz, 'id' | 'is_enabled'>): Promise<{ data: Quiz[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('quizzes')
    .insert({
      course_id: quiz.course_id,
      title: quiz.title,
      week: quiz.week,
      num_questions: quiz.num_questions,
      timer_seconds: quiz.timer_seconds,
      valid_from: quiz.valid_from || null,
      valid_to: quiz.valid_to || null,
      is_enabled: true, // Default to enabled on creation
    })
    .select();

  return { data: data as Quiz[], error };
};

export const toggleQuizStatus = async (id: string, is_enabled: boolean): Promise<{ data: Quiz[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('quizzes')
    .update({ is_enabled: !is_enabled })
    .eq('id', id)
    .select();

  return { data: data as Quiz[], error };
};

export const deleteQuiz = async (id: string): Promise<{ error: any }> => {
  const { error } = await supabase.from('quizzes').delete().eq('id', id);
  return { error };
};

export const fetchQuestions = async (quizId: string): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('quiz_id', quizId);

  if (error) {
    console.error('Error fetching questions:', error.message);
    return [];
  }
  return data as Question[];
};

export const addQuestion = async (question: Omit<Question, 'id'>): Promise<{ data: Question[] | null; error: any }> => {
  const { data, error } = await supabase.from('questions').insert([
    {
      quiz_id: question.quiz_id,
      question_text: question.question_text,
      options: question.options,
      correct_option: question.correct_option,
    },
  ]).select();
  return { data: data as Question[], error };
};

export const deleteQuestion = async (id: string): Promise<{ error: any }> => {
  const { error } = await supabase.from('questions').delete().eq('id', id);
  return { error };
};

export const updateQuiz = async (id: string, updates: Partial<Omit<Quiz, 'id' | 'course_id'>>) => {
  const { data, error } = await supabase
    .from('quizzes')
    .update(updates)
    .eq('id', id)
    .select();

  return { data, error };
};
