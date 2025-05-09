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
    <div className="flex h-full flex-col justify-end">
      {label && (
        <Label className="leading-tight font-bold text-white" name={label} />
      )}
      <button
        id={label}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`mt-1 flex h-10 items-center rounded-md px-0 ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
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
