'use client';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';
import EntryCard from './entryCard';
import LabeledInput from './generic/labeledInput';

interface Question {
  id: number;
  created_at: string;
  question: string;
  type: string;
  priority: number;
}

interface QAInputProps {
  question: string; // current question text
  answer: string; // current answer text
  onQuestionChange: (question: string) => void;
  onAnswerChange: (answer: string) => void;
  onClose?: () => void; // for deleting this entry
  index: number;
  /**
   * Newly added prop: the list of possible questions from the DB (only fetched once in parent)
   */
  questionOptions: Question[];
}

const QAInput: React.FC<QAInputProps> = ({
  question,
  answer,
  onQuestionChange,
  onAnswerChange,
  onClose,
  index,
  questionOptions,
}) => {
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
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        list="question-options"
      />

      {/* The datalist is generated from `questionOptions` passed from the parent */}
      <datalist id="question-options">
        {questionOptions.map((q) => (
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
