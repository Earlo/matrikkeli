import CloseButton from '../generic/closeButton';
import IconButton from '../generic/iconButton';

interface ControlBarProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

const ControlBar: React.FC<ControlBarProps> = ({
  onClose,
  onMinimize,
  onMaximize,
}) => (
  <>
    {onMaximize && (
      <div className="absolute top-0 right-6 z-20">
        <IconButton onClick={onMaximize} icon="grow" />
      </div>
    )}
    {onMinimize && (
      <div className="absolute top-0 right-6 z-20">
        <IconButton onClick={onMinimize} icon="reduce" />
      </div>
    )}
    {onClose && (
      <div className="absolute top-0 right-0 z-20">
        <CloseButton onClick={onClose} />
      </div>
    )}
  </>
);

export default ControlBar;
