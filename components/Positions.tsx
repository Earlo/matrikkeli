import AddLabel from './generic/addLabel';
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
    <div className="max-w-lg mt-1">
      <AddLabel
        label={label}
        handleAdd={handleAdd}
        disabled={positions.length >= 5}
      />
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
