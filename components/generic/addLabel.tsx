import { cn } from '@/lib/helpers';
import AddButton from './addButton';
import Label from './label';

interface AddLabelProps {
  label: string;
  disabled: boolean;
  handleAdd: () => void;
}

const AddLabel: React.FC<AddLabelProps> = ({
  label,
  disabled = false,
  handleAdd,
}) => {
  return (
    <div className="flex items-center justify-between mb-0.5">
      <Label
        name={label}
        className={cn(
          'h-[16px] w-fit text-gray-900 transition ease-in-out font-bold',
        )}
      />
      <AddButton onClick={handleAdd} disabled={disabled} />
    </div>
  );
};

export default AddLabel;
