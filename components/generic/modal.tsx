import { cn } from '@/lib/helpers';
import CloseButton from './closeButton';

interface ModalProps {
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, className, children }) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        className,
      )}
    >
      <div className="relative w-lg m-1 overflow-hidden rounded-lg bg-white shadow-lg md:w-1/2">
        {onClose && (
          <CloseButton
            onClick={onClose}
            className="absolute right-0.5 top-0.5 z-100"
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
