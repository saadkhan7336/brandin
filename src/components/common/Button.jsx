
import { cn } from '../../utils/helper.js';

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className,
  isLoading,
  loading,
  children,
  ...props 
}) {
  const isCurrentlyLoading = isLoading || loading;

  const baseStyles = "inline-flex items-center justify-center rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#3b82f6] text-white hover:bg-[#2563eb]",
    success: "bg-[#10b981] text-white hover:bg-[#059669]",
    danger: "bg-[#ef4444] text-white hover:bg-[#dc2626]",
    warning: "bg-[#f59e0b] text-white hover:bg-[#d97706]",
    secondary: "bg-[#6b7280] text-white hover:bg-[#4b5563]",
    outline: "border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#eff6ff]",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isCurrentlyLoading || props.disabled}
      {...props}
    >
      {isCurrentlyLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : children}
    </button>
  );
}
