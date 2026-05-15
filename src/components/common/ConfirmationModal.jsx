import React from 'react';
import Modal from './Modal';
import { Button } from './Button';
import { AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  variant = "primary", // primary, danger, success
  isLoading = false 
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger': return <AlertCircle className="w-12 h-12 text-red-500" />;
      case 'success': return <CheckCircle2 className="w-12 h-12 text-green-500" />;
      default: return <HelpCircle className="w-12 h-12 text-blue-500" />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-gray-50 rounded-full">
          {getIcon()}
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-600 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full mt-6">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl border-gray-200 text-gray-500 hover:bg-gray-50"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'primary'}
            className="flex-1 rounded-2xl shadow-lg"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
