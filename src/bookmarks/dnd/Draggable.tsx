import { useDraggable } from '@dnd-kit/core';
import React from 'react';
import { DragWrapperProps } from '../../types/interfaces';

export default function Draggable({ id, children }: DragWrapperProps): JSX.Element {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
}
