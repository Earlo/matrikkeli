'use client';
import { cn } from '@/lib/helpers';
import Image from 'next/image';

interface ProfileImageProps {
  src?: string;
  alt?: string;
  size?: number; // default size in px
  className?: string;
  children?: React.ReactNode;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt = 'Profile Image',
  size = 192,
  className = '',
  children,
}) => {
  return (
    <div
      className={cn(
        'relative rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-none h-48 w-48 overflow-hidden',
        className,
      )}
    >
      <Image
        src={src || '/blank_user_filled.png'}
        alt={alt}
        width={size}
        height={size}
        className={cn(
          'rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-none object-cover bg-[#F1742B]',
        )}
        priority
      />
      {children}
    </div>
  );
};

export default ProfileImage;
