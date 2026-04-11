import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/helper.js';

/**
 * Enhanced Input — supports password toggle, left icon, error messages.
 */
export function Input({ label, error, className, icon, type = 'text', ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1.5 text-sm font-semibold text-[#374151]">
          {label}
          {props.required && <span className="text-[#ef4444] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          className={cn(
            "w-full py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30 focus:border-[#3b82f6] transition-all text-sm",
            icon ? "pl-10 pr-4" : "px-4",
            isPassword && "pr-11",
            icon && isPassword && "pl-10 pr-11",
            error
              ? "border-[#ef4444] bg-red-50/30 focus:ring-red-400/20 focus:border-[#ef4444]"
              : "border-[#d1d5db] bg-white",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-[#ef4444] flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({ label, error, options, className, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1.5 text-sm font-semibold text-[#374151]">
          {label}
          {props.required && <span className="text-[#ef4444] ml-1">*</span>}
        </label>
      )}
      <select
        className={cn(
          "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30 focus:border-[#3b82f6] transition-all bg-white text-sm",
          error ? "border-[#ef4444]" : "border-[#d1d5db]",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-[#ef4444] flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1.5 text-sm font-semibold text-[#374151]">
          {label}
          {props.required && <span className="text-[#ef4444] ml-1">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          "w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30 focus:border-[#3b82f6] transition-all text-sm",
          error ? "border-[#ef4444]" : "border-[#d1d5db]",
          className
        )}
        rows={4}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs font-medium text-[#ef4444] flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
