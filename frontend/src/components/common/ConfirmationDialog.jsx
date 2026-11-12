import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = true
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 py-2">
        <div className={`p-3 border-2 border-brand-black rounded shadow-hard-sm ${danger ? 'bg-brand-urgent text-white' : 'bg-brand-chartreuse text-brand-black'}`}>
          <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
        </div>
        <p className="text-sm font-medium text-neutral-800 leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-brand-black/20">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-white text-brand-black font-bold text-sm border-2 border-brand-black rounded brutal-btn shadow-hard-sm hover:bg-neutral-100"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-brand-black font-extrabold text-sm border-2 border-brand-black rounded brutal-btn shadow-hard-sm ${
            danger ? 'bg-brand-urgent text-white hover:bg-red-600' : 'bg-brand-chartreuse hover:bg-yellow-300'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

