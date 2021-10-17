import SortIcon from '@mui/icons-material/Sort';
import { IconButton, Tooltip } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { recursiveSortChildren, sortChildren } from '../../../redux/bookmarksSlice';
import store from '../../../redux/store';
import { setMoveToDialog, setNodeCrudDialog } from '../../../redux/viewSlice';
import { SortChildrenOperation } from '../../../types/operations';
import StyledMenu from '../StyledMenu';

interface BookmarkMenuProps {
  node: chrome.bookmarks.BookmarkTreeNode;
  nodeType: 'root_folder' | 'folder' | 'link';
}

export default function BookmarkMenu({ node, nodeType }: BookmarkMenuProps): JSX.Element {
  const handleOpenNodeModal = useCallback(
    (mode, type) => {
      const nodeToUpdate = mode === 'update' || mode === 'delete' ? node : undefined;
      store.dispatch(
        setNodeCrudDialog({ isOpen: true, mode, type, parentId: node.id, node: nodeToUpdate }),
      );
    },
    [node],
  );

  const handleSortChildren = useCallback(() => {
    const sortChildrenOperation = new SortChildrenOperation(node);
    store.dispatch(sortChildren(sortChildrenOperation));
  }, [node]);

  const handleRecursiveSortChildren = useCallback(() => {
    const sortChildrenOperation = new SortChildrenOperation(node);
    store.dispatch(recursiveSortChildren(sortChildrenOperation));
  }, [node]);

  const handleMoveTo = useCallback(() => {
    store.dispatch(setMoveToDialog({ isOpen: true, node }));
  }, [node]);

  const menuItems = useMemo(() => {
    const options = [];
    if (nodeType === 'folder' || nodeType === 'link') {
      options.push(
        { text: 'Edit', onClick: () => handleOpenNodeModal('update', nodeType) },
        { text: 'Delete', onClick: () => handleOpenNodeModal('delete', nodeType) },
        { text: 'Move to', onClick: handleMoveTo },
      );
    }
    if (nodeType === 'folder' || nodeType === 'root_folder') {
      options.push(
        {
          text: 'Create folder',
          onClick: () => handleOpenNodeModal('create', 'folder'),
        },
        {
          text: 'Create link',
          onClick: () => handleOpenNodeModal('create', 'link'),
        },
        {
          text: 'Sort children by name',
          onClick: handleSortChildren,
        },
        {
          text: 'Recursive sort children by name',
          onClick: handleRecursiveSortChildren,
        },
      );
    }
    return options;
  }, [
    handleMoveTo,
    handleOpenNodeModal,
    handleRecursiveSortChildren,
    handleSortChildren,
    nodeType,
  ]);

  return (
    <div style={{ display: 'flex', paddingRight: '10px' }}>
      {nodeType !== 'link' && (
        <Tooltip title="Sort children">
          <IconButton size="small" onClick={handleSortChildren}>
            <SortIcon />
          </IconButton>
        </Tooltip>
      )}
      <StyledMenu items={menuItems} />
    </div>
  );
}
