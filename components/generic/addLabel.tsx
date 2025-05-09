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
    <div className="mb-0.5 flex items-center justify-between">
      <Label
        name={label}
        className={cn(
          'h-[16px] w-fit font-bold text-white transition ease-in-out',
        )}
      />
      <AddButton onClick={handleAdd} disabled={disabled} />
    </div>
  );
};

export default AddLabel;
