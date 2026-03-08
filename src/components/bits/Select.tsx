import React from 'react';

type RiskLevel = 'low' | 'medium' | 'high';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  helperText?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export default function Select({ label, helperText, required, id, options, ...rest }: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {helperText && <p className="text-xs text-gray-500 mb-2">{helperText}</p>}
      <select
        id={id}
        required={required}
        className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200 appearance-none cursor-pointer"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1a1a2e] text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export const RISK_OPTIONS: { value: RiskLevel; label: string }[] = [
  { value: 'low', label: 'Low Risk' },
  { value: 'medium', label: 'Medium Risk' },
  { value: 'high', label: 'High Risk' },
];
