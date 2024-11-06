'use client';
import { cn } from '@/lib/utils';

interface LoadingDotsProps {
  className?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ className }) => {
  return (
    <div className='flex items-center justify-center space-x-1.5 py-1'>
      <div
        className={cn(
          'dot bg-black w-1.5 h-1.5 rounded-full animate-bounce delay-0',
          className
        )}
      />
      <div
        className={cn(
          'dot bg-black w-1.5 h-1.5 rounded-full animate-bounce delay-150',
          className
        )}
      />
      <div
        className={cn(
          'dot bg-black w-1.5 h-1.5 rounded-full animate-bounce delay-300',
          className
        )}
      />
    </div>
  );
};

export default LoadingDots;
