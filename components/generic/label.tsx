import { cn } from '@/lib/helpers';

interface LabelProps {
  label?: string;
  name: string;
  children?: React.ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ label, name, children, className }) => (
  <label
    className={cn(
      'block text-sm font-medium whitespace-nowrap text-white',
      className,
    )}
    htmlFor={name}
  >
    {label ? label : name}
    {children}
  </label>
);

export default Label;
