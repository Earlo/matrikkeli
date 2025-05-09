import { cn } from '@/lib/helpers';
import { PlusIcon } from '@heroicons/react/24/solid';

interface AddButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}

const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  disabled,
  className = '',
}) => (
  <button
    type="button"
    disabled={disabled}
    className={cn(
      'rounded-full bg-blue-500 p-1 text-white transition hover:cursor-pointer hover:bg-blue-600',
      {
        'bg-gray-500 hover:cursor-default hover:bg-gray-500': disabled,
      },
      className,
    )}
    onClick={onClick}
  >
    <PlusIcon className="h-4 w-4" />
  </button>
);

export default AddButton;
