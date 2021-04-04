import Dialog from '@material-ui/core/Dialog';
import React from 'react';

interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BaseDialog({ isOpen, onClose, children }: BaseDialogProps): JSX.Element {
  return (
    <Dialog fullWidth disableEscapeKeyDown disableBackdropClick open={isOpen} onClose={onClose}>
      {children}
    </Dialog>
  );
}
