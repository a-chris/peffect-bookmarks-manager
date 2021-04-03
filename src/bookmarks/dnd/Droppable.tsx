import { useDroppable } from '@dnd-kit/core';
import React from 'react';
import { DropWrapperProps } from '../../types/interfaces';

export default function Droppable({ id, droppableChildren }: DropWrapperProps): JSX.Element {
  const { isOver, setNodeRef } = useDroppable({ id });

  return <div ref={setNodeRef}>{droppableChildren(isOver)}</div>;
}
