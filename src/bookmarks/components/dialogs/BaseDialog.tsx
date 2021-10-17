import Dialog from '@mui/material/Dialog';
import React from 'react';

interface BaseDialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function BaseDialog({ isOpen, onClose, children }: BaseDialogProps): JSX.Element {
  return (
    <Dialog fullWidth disableEscapeKeyDown open={isOpen} onClose={onClose}>
      {children}
    </Dialog>
  );
}
