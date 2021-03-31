import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useEffectOnce } from 'react-use';
import { moveNode } from '../../../redux/bookmarksSlice';
import store from '../../../redux/store';
import { DragNodeWithType } from '../../../types/dnd';
import { NodeProps } from '../../../types/interfaces';
import { MoveOperation } from '../../../types/operations';

interface DragAndDropNodeRenderProps {
  children: ({ isOver }: { isOver: boolean }) => React.ReactNode;
}

export default function DragAndDropNode({
  node,
  children,
}: NodeProps & DragAndDropNodeRenderProps): JSX.Element {
  const [, dragRef, dragPreview] = useDrag({
    item: { node, type: 'node' } as DragNodeWithType,
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: 'node',
    drop: (item: DragNodeWithType) => {
      // item is the node being dropped
      if (item.node.id === node.id) return;

      // move the node if it is different than the destination
      const destination =
        node.url == null
          ? { parentId: node.id, index: 0 }
          : { parentId: node.parentId, index: node.index };

      const moveOperation = new MoveOperation(item.node, destination);
      store.dispatch(moveNode(moveOperation));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  useEffectOnce(() => {
    // hide the default drag preview displayed by react-dnd
    dragPreview(getEmptyImage());
  });

  function attachRef(el: HTMLDivElement) {
    // from https://github.com/react-dnd/react-dnd/issues/1483
    dragRef(el);
    dropRef(el);
  }

  return <div ref={attachRef}>{children({ isOver })}</div>;
}
