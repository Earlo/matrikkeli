import PositionCard from './positionCard';

const Positions = ({
  positions = [],
  setPositions,
  buttonText,
}: {
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
  const handleAddPosition = () => {
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
    <div>
      {positions.map((position) => (
        <PositionCard
          key={position.id}
          position={position}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      ))}
      <button
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        onClick={handleAddPosition}
      >
        {buttonText || 'Add position'}
      </button>
    </div>
  );
};

export default Positions;
