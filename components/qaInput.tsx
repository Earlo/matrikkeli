'use client';
import { client } from '@/lib/supabase';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
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
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h4 className="text-lg font-semibold flex items-center justify-between">
        {`QA #${index}`}
        <div className="flex gap-2">
          <TrashIcon
            className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => onClose()}
          />
        </div>
      </h4>

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
      <div className="mt-4">
        <LabeledInput
          name="Answer"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          multiline
        />
      </div>
    </div>
  );
};

export default QAInput;
