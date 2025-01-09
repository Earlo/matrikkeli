import { cn } from '@/lib/helpers';
import Input from './input';
import Label from './label';

interface LabeledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  multiline?: boolean;
  placeholder?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  wrapperClassName?: string;
  list?: string;
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
  list,
}) => (
  <div className={cn('mt-1', wrapperClassName)}>
    <Label
      name={name}
      className={cn(
        'h-[16px] w-fit text-gray-900 transition ease-in-out font-bold',
        {
          'translate-x-[7px] translate-y-[25px] select-none bg-slate-200 text-gray-500 font-medium':
            !value && !placeholder && type != 'date',
          'select-text': !!value,
        },
      )}
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
      list={!multiline ? list : undefined}
    />
  </div>
);

export default LabeledInput;
