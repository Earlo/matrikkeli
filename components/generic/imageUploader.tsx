'use client';
import { cn } from '@/lib/helpers';
import { handleUpload } from '@/lib/supabase';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import LoadingSpinner from './loadingSpinner';

interface ImageUploaderProps {
  setIcon: (icon: string) => void;
  icon?: string;
  path?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  context?: object;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  setIcon,
  icon,
  path,
  disabled = false,
  className,
  children,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const url = await handleUpload(file, path, 'matrikkeli');
      setIcon(url);
    }
    setIsLoading(false);
  };
  return (
    <div className="relative inline-block">
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        disabled={disabled}
      />
      {isLoading ? (
        <div className="flex h-48 w-48 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div
          className={cn(
            'relative  rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-none h-48 w-48 overflow-hidden',
            className,
          )}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        >
          <Image
            src={icon || '/blank_user_filled.png'}
            alt="Upload Image"
            className={cn(
              'rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-none bg-[#F1742B]',
              {
                'cursor-pointer': !disabled,
              },
            )}
            width={192}
            height={192}
          />
          {children ? (
            <div className="absolute inset-0 flex items-center justify-between transition-opacity duration-200 opacity-0 hover:opacity-100">
              <div className="flex h-full w-full items-center justify-center rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-none bg-black/30">
                {children}
              </div>
            </div>
          ) : (
            !disabled && (
              <div className="absolute inset-0 flex items-center justify-between transition-opacity duration-200 opacity-0 hover:opacity-100">
                <div className="flex h-full w-full items-center justify-center rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-none bg-black/30">
                  <ArrowUpOnSquareIcon
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className="h-6 w-6"
                  />
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
