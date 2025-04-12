'use client';

import Label from './label';

interface ToggleSwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function ToggleSwitch({
  label,
  checked,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  const handleToggle = () => {
    if (!disabled) onChange(!checked);
  };

  return (
    <div className="flex flex-col justify-end h-full">
      {label && (
        <Label className="text-gray-900 font-bold leading-tight" name={label} />
      )}
      <button
        id={label}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`flex items-center h-10 mt-1 rounded-md px-0 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            checked ? 'bg-orange-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </div>
      </button>
    </div>
  );
}
