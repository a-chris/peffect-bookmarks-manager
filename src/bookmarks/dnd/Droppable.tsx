import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { DragWrapperProps } from '../../types/interfaces';

export default function Droppable({ id, children }: DragWrapperProps): JSX.Element {
  const { setNodeRef } = useDroppable({ id });

  return <div ref={setNodeRef}>{children}</div>;
}
