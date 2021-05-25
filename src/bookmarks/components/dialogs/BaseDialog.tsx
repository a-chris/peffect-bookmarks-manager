import Dialog from '@material-ui/core/Dialog';
import React from 'react';

interface BaseDialogProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onExited?: () => void;
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
