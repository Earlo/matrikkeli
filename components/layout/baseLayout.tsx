import { cn } from '@/lib/helpers';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('flex flex-auto flex-col bg-orange-600', className)}>
      {children}
    </div>
  );
};

export default BaseLayout;
