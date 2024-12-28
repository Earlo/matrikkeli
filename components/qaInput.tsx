'use client';
import { client } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import LabeledInput from './generic/labeledInput';

interface QAInputProps {
  question: string;
  answer: string;
  onQuestionChange: (question: string) => void;
  onAnswerChange: (answer: string) => void;
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
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await client
          .from('questions')
          .select('*')
          .order('priority', { ascending: true })
          .order('question', { ascending: true });

        if (error) {
          console.error('Error fetching questions:', error.message);
          return;
        }

        setQuestions(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return <div>Loading questions...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQuestionChange(e.target.value);
  };

  return (
    <div className="mt-4">
      <LabeledInput
        name="Fun Fact Question"
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
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          multiline
        />
      </div>
    </div>
  );
};

export default QAInput;
