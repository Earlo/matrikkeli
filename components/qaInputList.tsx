'use client';
import { PlusIcon } from '@heroicons/react/24/solid';
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
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Questions</h3>
        <button
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          onClick={handleAdd}
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
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
            index={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default QAInputList;
