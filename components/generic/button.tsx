import { cn } from '@/lib/helpers';

interface ButtonProps {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  type,
  disabled,
  onClick,
  className = '',
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'focus:shadow-outline rounded bg-blue-600 px-2 py-1 font-bold text-white hover:bg-blue-700 focus:outline-hidden hover:cursor-pointer min-w-fit whitespace-nowrap',
      className,
      { 'bg-gray-400 hover:bg-gray-400 cursor-default': disabled },
    )}
  >
    {label}
  </button>
);

export default Button;
