import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import store, { RootStore } from '../../../redux/store';
import { toggleFolderOpen } from '../../../redux/viewSlice';
import { NodeDndProps } from '../../../types/interfaces';
import { generateUniqueId } from '../../../utils/dndUtils';
import Draggable from '../dnd/Draggable';
import Droppable from '../dnd/Droppable';
import NodeFolder from './NodeFolder';
import NodeLink from './NodeLink';

export default function Node({
  node,
  suffix,
  isRoot,
  isDroppable,
  isDraggable,
}: NodeDndProps): JSX.Element {
  const { foldersOpen } = useSelector((state: RootStore) => state.view);

  const uniqueId = useMemo(() => generateUniqueId(node.id, suffix), [node.id, suffix]);

  const isOpen = foldersOpen.has(uniqueId);

  const handleOpen = useCallback(() => {
    store.dispatch(toggleFolderOpen({ isOpen: !isOpen, uniqueId }));
  }, [isOpen, uniqueId]);

  const hasChildren = node.children?.length != null && node.children.length > 0;

  console.log(node.title);
  return (
    <div>
      <Draggable id={uniqueId} isDraggable={isDraggable}>
        {node.url ? (
          <NodeLink isOver={false} node={node} suffix={suffix} />
        ) : (
          <Droppable
            id={uniqueId}
            isDroppable={isDroppable}
            droppableChildren={(isOver) => (
              <NodeFolder
                node={node}
                suffix={suffix}
                isRoot={isRoot}
                isOpen={isOpen}
                isOver={isOver}
                onOpen={handleOpen}
              />
            )}
          />
        )}
      </Draggable>
      {isOpen && hasChildren && (
        <div className="folder">
          {node.children?.map((n) => (
            <Node
              node={n}
              key={n.id}
              suffix={suffix}
              isDroppable={isDroppable}
              isDraggable={isDraggable}
            />
          ))}
        </div>
      )}
    </div>
  );
}
