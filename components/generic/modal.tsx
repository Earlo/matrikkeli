import { cn } from '@/lib/helpers';
import CloseButton from './closeButton';

interface ModalProps {
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, className, children }) => {
  return (
    <div className={cn('fixed inset-0 z-50 overflow-y-auto', className)}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-lg bg-gray-500 shadow-lg">
          {onClose && (
            <CloseButton
              onClick={onClose}
              className="absolute top-0.5 right-0.5 z-50"
            />
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
