import { cn } from '@/lib/helpers';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface CloseButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}

const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  className = '',
  disabled = false,
}) => (
  <button
    type="button"
    disabled={disabled}
    className={cn(
      'hover:cursor-pointer  text-gray-700  hover:text-gray-500 transition',
      {
        'hover:cursor-default': disabled,
      },
      className,
    )}
    onClick={onClick}
  >
    <span className="sr-only">Close</span>
    <XMarkIcon className="h-5 w-5" />
  </button>
);

export default CloseButton;
