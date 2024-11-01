import { cn } from '@/lib/helpers';
import { HTMLInputTypeAttribute } from 'react';
import Input from './input';
import Label from './label';

interface LabeledInputProps {
  name: string;
  type?: HTMLInputTypeAttribute;
  value?: string;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  name,
  type = 'text',
  value,
  required,
  multiline = false,
  placeholder,
  onChange,
  disabled = false,
  className,
  wrapperClassName,
}) => (
  <div className={cn('mt-1', wrapperClassName)}>
    <Label
      name={name}
      className={cn('h-[16px] w-fit text-gray-700 transition ease-in-out', {
        'translate-x-[10px] translate-y-7 select-none bg-slate-200 text-gray-500':
          !value && !placeholder && type != 'date',
        'select-text': !!value,
      })}
    />
    <Input
      name={name}
      type={type}
      value={value}
      required={required}
      multiline={multiline}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      className={cn(
        'rounded-tl-none bg-slate-200 focus:outline-none',
        className,
      )}
    />
  </div>
);

export default LabeledInput;
