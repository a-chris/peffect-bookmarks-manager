import React from 'react';
import { useDrop } from 'react-dnd';
import { moveNode } from '../../../redux/bookmarksSlice';
import store from '../../../redux/store';
import { DragNodeWithType } from '../../../types/dnd';
import { NodeProps } from '../../../types/interfaces';
import { MoveOperation } from '../../../types/operations';

interface DropWrapperProps {
  children: ({ isOver }: { isOver: boolean }) => React.ReactNode;
}

export default function DropWrapper({ node, children }: NodeProps & DropWrapperProps): JSX.Element {
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

  return <div ref={dropRef}>{children({ isOver })}</div>;
}
