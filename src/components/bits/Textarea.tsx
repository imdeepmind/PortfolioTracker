import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  required?: boolean;
}

export default function Textarea({ label, helperText, required, id, ...rest }: TextareaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {helperText && <p className="text-xs text-gray-500 mb-2">{helperText}</p>}
      <textarea
        id={id}
        required={required}
        className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200 resize-none"
        {...rest}
      />
    </div>
  );
}
