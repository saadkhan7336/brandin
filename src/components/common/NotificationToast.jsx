import React from 'react';
import { Info, AlertCircle, CheckCircle2, XCircle, X } from 'lucide-react';
import { toast } from 'sonner';

export const NotificationToast = ({ t, notification }) => {
  const type = notification.type || 'info';
  let Icon = Info;
  let iconColor = '#3B82F6'; // blue-500

  if (type.includes('success') || type.includes('completed') || type.includes('approved') || type.includes('delivered')) {
    Icon = CheckCircle2;
    iconColor = '#10B981'; // emerald-500
  } else if (type.includes('warning') || type.includes('revision') || type.includes('pending')) {
    Icon = AlertCircle;
    iconColor = '#F59E0B'; // amber-500
  } else if (type.includes('error') || type.includes('failed') || type.includes('cancelled') || type.includes('rejected')) {
    Icon = XCircle;
    iconColor = '#EF4444'; // rose-500
  }

  const handleClose = () => {
    toast.dismiss(t);
  };

  return (
    <div className="w-[356px] bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl p-4 flex gap-3 text-sm font-sans" style={{ pointerEvents: 'auto' }}>
      <div className="shrink-0 mt-0.5">
        {/* Simulating filled icon similar to the image by using fill and color */}
        <Icon size={16} fill={iconColor} color="#0F172A" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-white font-semibold leading-tight">{notification.title || "New Notification"}</h4>
          <button onClick={handleClose} className="text-[#64748B] hover:text-white transition-colors shrink-0">
            <X size={14} />
          </button>
        </div>
        
        {notification.message && (
          <p className="mt-1 text-[#94A3B8] text-[13px] leading-relaxed pr-2">
            {notification.message}
          </p>
        )}
        
        <div className="mt-3 text-[#475569] text-[11px] font-medium tracking-wide">
          {new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
        </div>
        
        {notification.link ? (
          <div className="mt-3 flex items-center gap-4">
             <a 
               href={notification.link}
               className="text-white font-semibold text-[13px] hover:underline transition-all"
               onClick={() => toast.dismiss(t)}
             >
               View context
             </a>
             <button 
               onClick={handleClose} 
               className="text-[#94A3B8] font-medium text-[13px] hover:text-white transition-all underline decoration-transparent hover:decoration-white underline-offset-4"
             >
               Dismiss
             </button>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-4">
            <button 
               onClick={handleClose} 
               className="text-white font-semibold text-[13px] hover:underline transition-all"
             >
               Acknowledge
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
