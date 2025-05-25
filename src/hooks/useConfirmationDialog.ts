
import { useState } from 'react';

interface ConfirmationDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
}

export const useConfirmationDialog = () => {
  const [confirmationDialog, setConfirmationDialog] = useState<ConfirmationDialogState>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const openConfirmationDialog = (title: string, description: string, onConfirm: () => void) => {
    setConfirmationDialog({
      isOpen: true,
      title,
      description,
      onConfirm
    });
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
  };

  return {
    confirmationDialog,
    openConfirmationDialog,
    closeConfirmationDialog
  };
};
