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
      'p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 hover:cursor-pointer transition',
      {
        'bg-gray-500 hover:bg-gray-500 hover:cursor-default': disabled,
      },
      className,
    )}
    onClick={onClick}
  >
    <PlusIcon className="h-4 w-4" />
  </button>
);

export default AddButton;
