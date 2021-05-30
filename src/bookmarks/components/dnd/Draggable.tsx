import { useDraggable } from '@dnd-kit/core';
import React from 'react';
import { DragWrapperProps } from '../../../types/interfaces';

export default function Draggable({ id, isDraggable, children }: DragWrapperProps): JSX.Element {
  const { attributes, listeners, setNodeRef } = useDraggable({ id, disabled: !isDraggable });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
  // return isDraggable ? (
  //   <div ref={setNodeRef} {...listeners} {...attributes}>
  //     {children}
  //   </div>
  // ) : (
  //   <>{children}</>
  // );
}
