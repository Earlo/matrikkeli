import { cn } from '@/lib/helpers';
import { PlusIcon } from '@heroicons/react/24/solid';
import Label from './generic/label';
import PositionCard from './positionCard';

const Positions = ({
  label,
  positions = [],
  setPositions,
  buttonText,
}: {
  label: string;
  positions: {
    id: number;
    title: string;
    organization: string;
    start: string;
    end: string;
    description: string;
  }[];
  setPositions: (
    positions: {
      id: number;
      title: string;
      organization: string;
      start: string;
      end: string;
      description: string;
    }[],
  ) => void;
  buttonText?: string;
}) => {
  const handleAdd = () => {
    setPositions([
      ...positions,
      {
        id: positions.length + 1,
        title: '',
        organization: '',
        start: new Date().toISOString().split('T')[0], // sets today's date
        end: '',
        description: '',
      },
    ]);
  };

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    const updatedPositions = positions.map((pos) =>
      pos.id === id ? { ...pos, [name]: value } : pos,
    );
    setPositions(updatedPositions);
  };

  const handleDelete = (id) => {
    setPositions(positions.filter((pos) => pos.id !== id));
  };

  // Sort positions by start date
  positions.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  return (
    <div className="max-w-lg my-2">
      <div className="flex items-center justify-between mb-1">
        <Label
          name={label}
          className={cn(
            'h-[16px] w-fit text-gray-900 transition ease-in-out font-bold',
          )}
        />
        <button
          className={cn(
            'p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition',
            {
              'bg-gray-500 hover:bg-gray-500 hover:cursor-default':
                positions.length >= 5,
            },
          )}
          disabled={positions.length >= 5}
          onClick={handleAdd}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-2 space-y-1">
        {positions.map((position) => (
          <PositionCard
            key={position.id}
            position={position}
            onChange={handleChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Positions;
