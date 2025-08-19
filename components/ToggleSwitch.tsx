import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
}

const ToggleSwitch = ({ checked, onChange, onIcon, offIcon }: ToggleSwitchProps): React.ReactNode => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600"></div>
      <span className="absolute left-1 top-1 h-5 w-5 bg-white dark:bg-slate-900 rounded-full transition-transform peer-checked:translate-x-7 flex items-center justify-center text-slate-500">
        {checked ? onIcon : offIcon}
      </span>
    </label>
  );
};

export default ToggleSwitch;
