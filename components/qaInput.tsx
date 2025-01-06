'use client';
import { client } from '@/lib/supabase';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import EntryCard from './entryCard';
import LabeledInput from './generic/labeledInput';

interface QAInputProps {
  question: string;
  answer: string;
  onQuestionChange: (question: string) => void;
  onAnswerChange: (answer: string) => void;
  onClose?: () => void;
  index: number;
}

interface Question {
  id: number;
  created_at: string;
  question: string;
  type: string;
  priority: number;
}

const QAInput: React.FC<QAInputProps> = ({
  question,
  answer,
  onQuestionChange,
  onAnswerChange,
  onClose,
  index,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await client
          .from('questions')
          .select('*')
          .order('priority', { ascending: true })
          .order('question', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        setQuestions(data || []);
      } catch (err) {
        console.error('Error fetching questions:', err.message);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-4">
        <div className="loader border-t-blue-500 border-4 h-6 w-6 rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-500">Loading questions...</span>
      </div>
    );
  }

  if (error) {
    return <div className="mt-4 text-red-500 text-sm">{error}</div>;
  }
  return (
    <EntryCard
      label={
        <div className="flex items-center">
          <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />
          <span className="ml-2 text-gray-700 font-medium">
            {`#${index + 1} ${question || 'New Question'}`}
          </span>
        </div>
      }
      onDelete={onClose}
    >
      <LabeledInput
        name="Fun Fact Question"
        placeholder="Start typing or select a question..."
        value={question || ''} // Ensure a controlled input
        onChange={(e) => onQuestionChange(e.target.value)}
        list="question-options"
      />
      <datalist id="question-options">
        {questions.map((q) => (
          <option key={q.id} value={q.question} />
        ))}
      </datalist>
      <LabeledInput
        name="Vastaus"
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        multiline
      />
    </EntryCard>
  );
};

export default QAInput;
