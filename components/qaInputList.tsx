'use client';
import QAInput from '@/components/qaInput';
import { client } from '@/lib/supabase/client';
import { QA, Question } from '@/schemas/user';
import { useEffect, useState } from 'react';
import AddLabel from './generic/addLabel';

export interface QAInputListProps {
  questions: QA[];
  onUpdate: (updatedQuestions: QA[]) => void;
  disabled?: boolean;
}

const QAInputList: React.FC<QAInputListProps> = ({
  questions,
  onUpdate,
  disabled = false,
}) => {
  const [questionOptions, setQuestionOptions] = useState<Question[]>([]);

  useEffect(() => {
    if (disabled) {
      setQuestionOptions([]);
      return;
    }
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
      }
    };
    fetchQuestions();
  }, [disabled]);

  const handleAdd = () => {
    if (disabled) return;
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
    if (disabled) return;
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: updatedQuestion,
      answer: updatedAnswer,
    };
    onUpdate(updatedQuestions);
  };

  const handleDelete = (index: number) => {
    if (disabled) return;
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onUpdate(updatedQuestions);
  };

  return (
    <div className="max-w-lg mt-1">
      <AddLabel
        label="Kysymyksiä"
        handleAdd={handleAdd}
        disabled={disabled || questions.length >= 5}
      />
      <div className="space-y-1">
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
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default QAInputList;
