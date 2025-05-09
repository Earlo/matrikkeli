'use client';
import { Question } from '@/schemas/user';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import EntryCard from './entryCard';
import LabeledInput from './generic/labeledInput';

export interface QAInputProps {
  question: string;
  answer: string;
  onQuestionChange: (question: string) => void;
  onAnswerChange: (answer: string) => void;
  onClose?: () => void;
  index: number;
  questionOptions: Question[];
  disabled?: boolean;
}

const QAInput: React.FC<QAInputProps> = ({
  question,
  answer,
  onQuestionChange,
  onAnswerChange,
  onClose,
  index,
  questionOptions,
  disabled = false,
}) => {
  return (
    <EntryCard
      onDelete={disabled ? undefined : onClose}
      label={
        <div className="flex items-center">
          <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />
          <span className="ml-2 font-medium text-gray-700">
            {`#${index + 1} ${question || 'New Question'}`}
          </span>
        </div>
      }
      disabled={disabled}
    >
      <LabeledInput
        name="Fun Fact Question"
        placeholder="Start typing or select a question..."
        value={question}
        onChange={(e) => !disabled && onQuestionChange(e.target.value)}
        list="question-options"
        disabled={disabled}
      />

      <datalist id="question-options">
        {questionOptions.map((q) => (
          <option key={q.id} value={q.question} />
        ))}
      </datalist>

      <LabeledInput
        name="Vastaus"
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => !disabled && onAnswerChange(e.target.value)}
        multiline
        disabled={disabled}
      />
    </EntryCard>
  );
};

export default QAInput;
