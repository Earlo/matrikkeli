'use client';
import QAInput from '@/components/qaInput';
import { client } from '@/lib/supabase';
import { QA, Question } from '@/schemas/user';
import { useEffect, useState } from 'react';
import AddLabel from './generic/addLabel';

interface QAInputListProps {
  questions: QA[];
  onUpdate: (updatedQuestions: QA[]) => void;
}

const QAInputList: React.FC<QAInputListProps> = ({ questions, onUpdate }) => {
  const [questionOptions, setQuestionOptions] = useState<Question[]>([]);
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
          throw new Error(error.message);
        }

        setQuestionOptions(data || []);
      } catch (err) {
        console.error('Error fetching questions:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAdd = () => {
    const newEntry: QA = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      question: '',
      answer: '',
      priority: questions.length,
    };
    onUpdate([...questions, newEntry]);
  };

  const handleEditSave = (
    index: number,
    updatedQuestion: string,
    updatedAnswer: string,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: updatedQuestion,
      answer: updatedAnswer,
    };
    onUpdate(updatedQuestions);
  };

  const handleDelete = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onUpdate(updatedQuestions);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-4">
        <div className="loader border-t-blue-500 border-4 h-6 w-6 rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-500">Loading questions...</span>
      </div>
    );
  }

  return (
    <div className="max-w-lg mt-1">
      <AddLabel
        label="Kysymyksiä"
        handleAdd={handleAdd}
        disabled={questions.length >= 5}
      />
      <div className="mb-2 space-y-1">
        {questions.map((q, index) => (
          <QAInput
            key={q.id}
            index={index}
            question={q.question}
            answer={q.answer}
            questionOptions={questionOptions}
            onQuestionChange={(newQuestion) =>
              handleEditSave(index, newQuestion, q.answer)
            }
            onAnswerChange={(newAnswer) =>
              handleEditSave(index, q.question, newAnswer)
            }
            onClose={() => handleDelete(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default QAInputList;
