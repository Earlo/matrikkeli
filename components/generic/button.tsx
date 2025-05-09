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
      'focus:shadow-outline min-w-fit rounded bg-blue-600 px-2 py-1 font-bold whitespace-nowrap text-white hover:cursor-pointer hover:bg-blue-700 focus:outline-hidden',
      className,
      { 'cursor-default bg-gray-400 hover:bg-gray-400': disabled },
    )}
  >
    {label}
  </button>
);

export default Button;
