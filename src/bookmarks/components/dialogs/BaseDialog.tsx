import Dialog from '@material-ui/core/Dialog';
import React from 'react';

interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExited: () => void;
  children: React.ReactNode;
}

export default function BaseDialog({
  isOpen,
  onClose,
  onExited,
  children,
}: BaseDialogProps): JSX.Element {
  return (
    <Dialog
      fullWidth
      disableEscapeKeyDown
      disableBackdropClick
      open={isOpen}
      onClose={onClose}
      onExited={onExited}
    >
      {children}
    </Dialog>
  );
}
