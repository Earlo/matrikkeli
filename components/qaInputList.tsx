'use client';
import { cn } from '@/lib/helpers';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Button from './generic/button';
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
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSave = (newQuestion: string, newAnswer: string) => {
    const newEntry: Question = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      question: newQuestion,
      type: newAnswer,
      priority: questions.length,
    };
    onUpdate([...questions, newEntry]);
    setIsAdding(false);
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
          className={cn(
            'p-2 bg-blue-500 text-white rounded-full transition',
            isAdding ? 'bg-gray-500' : 'hover:bg-blue-600',
          )}
          disabled={isAdding}
          onClick={() => setIsAdding(!isAdding)}
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <QAInput
              question={q.question}
              answer={q.type}
              onQuestionChange={(newQuestion) =>
                handleEditSave(index, newQuestion, q.type)
              }
              onAnswerChange={(newAnswer) =>
                handleEditSave(index, q.question, newAnswer)
              }
            />
            <Button
              label="Delete"
              type="button"
              className="bg-red-500 text-white mt-2"
              onClick={() => handleDelete(index)}
            />
          </div>
        ))}
        {isAdding && (
          <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <QAInput
              question=""
              answer=""
              onQuestionChange={(newQuestion) => handleAddSave(newQuestion, '')}
              onAnswerChange={(newAnswer) => handleAddSave('', newAnswer)}
            />
            <Button
              label="Cancel"
              type="button"
              className="bg-gray-500 text-white mt-2"
              onClick={() => setIsAdding(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QAInputList;
