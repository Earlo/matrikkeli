'use client';
import { cn } from '@/lib/helpers';
import { client } from '@/lib/supabase';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import Label from './generic/label';
import QAInput from './qaInput';

interface Question {
  id: number;
  created_at: string;
  question: string;
  type: string;
  priority: number;
}

interface QAInputListProps {
  questions: Question[];
  onUpdate: (updatedQuestions: Question[]) => void;
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
      } catch (err: any) {
        console.error('Error fetching questions:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAdd = () => {
    const newEntry: Question = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      question: '',
      type: '',
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
      type: updatedAnswer,
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
      <div className="flex items-center justify-between mb-1">
        <Label
          name="Kysymyksiä"
          className={cn(
            'h-[16px] w-fit text-gray-900 transition ease-in-out font-bold',
          )}
        />
        <button
          className={cn(
            'p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition',
            {
              'bg-gray-500 hover:bg-gray-500 hover:cursor-default':
                questions.length >= 5,
            },
          )}
          disabled={questions.length >= 5}
          onClick={handleAdd}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-2 space-y-1">
        {questions.map((q, index) => (
          <QAInput
            key={q.id}
            index={index}
            question={q.question}
            answer={q.type}
            questionOptions={questionOptions}
            onQuestionChange={(newQuestion) =>
              handleEditSave(index, newQuestion, q.type)
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
