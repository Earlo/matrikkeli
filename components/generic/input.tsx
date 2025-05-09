import { cn } from '@/lib/helpers';
import { HTMLInputTypeAttribute } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  multiline?: boolean;
  disabled?: boolean;
  className?: string;
  list?: string;
}

const baseInputClasses =
  'mt-1 block w-full rounded-md border rounded-br-none border-gray-200 p-1 shadow-xs text-sm text-black';

const Input: React.FC<InputProps> = ({
  name,
  type = 'text',
  value,
  required,
  placeholder,
  onChange,
  multiline = false,
  disabled = false,
  className = '',
  list,
}) => {
  const combinedClasses = cn(baseInputClasses, className);

  return multiline ? (
    <textarea
      id={name}
      name={name}
      value={value}
      placeholder={placeholder}
      className={combinedClasses}
      required={required}
      onChange={onChange}
      disabled={disabled}
    />
  ) : (
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      className={combinedClasses}
      required={required}
      onChange={onChange}
      disabled={disabled}
      list={list}
    />
  );
};

export default Input;
