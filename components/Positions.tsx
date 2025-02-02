import AddLabel from './generic/addLabel';
import PositionCard from './positionCard';

export interface Position {
  id: number;
  title: string;
  organization: string;
  start: string;
  end: string;
  description: string;
}

export interface PositionsProps {
  label: string;
  positions: Position[];
  setPositions: (positions: Position[]) => void;
  disabled?: boolean;
}

const Positions: React.FC<PositionsProps> = ({
  label,
  positions = [],
  setPositions,
  disabled = false,
}) => {
  const handleAdd = () => {
    if (disabled) return;
    setPositions([
      ...positions,
      {
        id: positions.length + 1,
        title: '',
        organization: '',
        start: new Date().toISOString().split('T')[0],
        end: '',
        description: '',
      },
    ]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: number,
  ) => {
    if (disabled) return;
    const { name, value } = e.target;
    const updatedPositions = positions.map((pos) =>
      pos.id === id ? { ...pos, [name]: value } : pos,
    );
    setPositions(updatedPositions);
  };

  const handleDelete = (id: number) => {
    if (disabled) return;
    setPositions(positions.filter((pos) => pos.id !== id));
  };

  // Sort positions by start date (make a copy to avoid mutating props)
  const sortedPositions = [...positions].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  return (
    <div className="max-w-lg mt-1">
      <AddLabel
        label={label}
        handleAdd={handleAdd}
        disabled={disabled || positions.length >= 5}
      />
      <div className="space-y-1">
        {sortedPositions.map((position) => (
          <PositionCard
            key={position.id}
            position={position}
            onChange={handleChange}
            onDelete={handleDelete}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default Positions;
