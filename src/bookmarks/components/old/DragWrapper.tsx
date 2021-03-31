import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useEffectOnce } from 'react-use';
import { DragNodeWithType } from '../../../types/dnd';
import { NodeProps } from '../../../types/interfaces';

interface DragWrapperProps extends NodeProps {
  children: React.ReactNode;
}

export default function DragWrapper({ node, children }: DragWrapperProps): JSX.Element {
  const [, dragRef, dragPreview] = useDrag({
    item: { node, type: 'node' } as DragNodeWithType,
  });

  useEffectOnce(() => {
    // hide the default drag preview displayed by react-dnd
    dragPreview(getEmptyImage());
  });

  return <div ref={dragRef}>{children}</div>;
}
