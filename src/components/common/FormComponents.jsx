import { cn } from '../../utils/helper.js';

export function Input({ label, error, className, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-[#374151]">
          {label}
          {props.required && <span className="text-[#ef4444] ml-1">*</span>}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent",
          error ? "border-[#ef4444]" : "border-[#d1d5db]",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-[#ef4444]">{error}</p>}
    </div>
  );
}

export function Select({ label, error, options, className, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-[#374151]">
          {label}
          {props.required && <span className="text-[#ef4444] ml-1">*</span>}
        </label>
      )}
      <select
        className={cn(
          "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent bg-white",
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
      {error && <p className="mt-1 text-sm text-[#ef4444]">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-[#374151]">
          {label}
          {props.required && <span className="text-[#ef4444] ml-1">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent",
          error ? "border-[#ef4444]" : "border-[#d1d5db]",
          className
        )}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-[#ef4444]">{error}</p>}
    </div>
  );
}
