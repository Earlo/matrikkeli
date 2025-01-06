'use client';
import { cn } from '@/lib/helpers';
import { PlusIcon } from '@heroicons/react/24/solid';
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
  return (
    <div className="max-w-lg mt-1">
      <div className="flex items-center justify-between mb-1">
        <Label
          name="Questions"
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
            question={q.question}
            answer={q.type}
            onQuestionChange={(newQuestion) =>
              handleEditSave(index, newQuestion, q.type)
            }
            onAnswerChange={(newAnswer) =>
              handleEditSave(index, q.question, newAnswer)
            }
            onClose={() => handleDelete(index)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default QAInputList;
