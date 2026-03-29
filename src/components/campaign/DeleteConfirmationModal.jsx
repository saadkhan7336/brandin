import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import { Button } from '../common/Button';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, campaignName, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Campaign">
      <div className="text-center space-y-6 py-2">
        <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-900 font-bold text-xl">Are you absolutely sure?</p>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            You are about to delete <span className="text-red-600 font-bold uppercase underline decoration-2 underline-offset-4">{campaignName}</span>. This action is permanent and cannot be undone.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="outline" 
            className="flex-1 py-3 border-gray-200 text-gray-500 hover:bg-gray-50 rounded-2xl font-bold"
            onClick={onClose}
            disabled={loading}
          >
            Cancel, Keep it
          </Button>
          <Button 
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-red-200"
            onClick={onConfirm}
            isLoading={loading}
          >
            <Trash2 className="w-4 h-4" />
            <span>Yes, Delete Now</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
