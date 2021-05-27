import {
  IconButton,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { indigo, red } from '@material-ui/core/colors';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import FolderIcon from '@material-ui/icons/Folder';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import SortIcon from '@material-ui/icons/Sort';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { recursiveSortChildren, sortChildren } from '../../redux/bookmarksSlice';
import store, { RootStore } from '../../redux/store';
import { setMoveToDialog, setNodeDialog, toggleFolderOpen } from '../../redux/viewSlice';
import { BookmarkProps, NodeWithSuffixProps } from '../../types/interfaces';
import { SortChildrenOperation } from '../../types/operations';
import { generateUniqueId } from '../../utils/dndUtils';
import Draggable from '../dnd/Draggable';
import Droppable from '../dnd/Droppable';
import StyledAvatar from './StyledAvatar';
import StyledMenu from './StyledMenu';

const useStyles = makeStyles(() =>
  createStyles({
    list_item: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      '&:hover': {
        // turn off the "selected" effect on hover
        backgroundColor: 'inherit',
      },
    },
    list_item_title: {
      paddingTop: 0,
      paddingBottom: 0,
      '&:hover': {
        color: red[300],
      },
    },
    over_link_divider: {
      height: '2px',
      backgroundColor: indigo[400],
    },
  }),
);

export default function Node({ node, suffix, isRoot }: NodeWithSuffixProps): JSX.Element {
  const { foldersOpen } = useSelector((state: RootStore) => state.view);

  const uniqueId = useMemo(() => generateUniqueId(node.id, suffix), [node.id, suffix]);

  const isOpen = useMemo(() => foldersOpen.has(uniqueId), [uniqueId, foldersOpen]);

  const handleOpen = useCallback(() => {
    store.dispatch(toggleFolderOpen({ isOpen: !isOpen, uniqueId }));
  }, [isOpen, uniqueId]);

  const hasChildren = node.children?.length != null && node.children.length > 0;

  return (
    <div>
      <Draggable id={uniqueId}>
        {node.url ? (
          <NodeLink isOver={false} node={node} suffix={suffix} />
        ) : (
          <Droppable
            id={uniqueId}
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
            <Node node={n} key={n.id} suffix={suffix} />
          ))}
        </div>
      )}
    </div>
  );
}

function NodeFolder({ node, isOpen, isOver, isRoot, onOpen }: BookmarkProps): JSX.Element {
  const styles = useStyles();

  const hasChildren = node.children?.length != null && node.children.length > 0;

  return (
    <ListItem button divider disableGutters selected={isOver} className={styles.list_item}>
      <IconButton
        onClick={onOpen}
        disabled={!hasChildren}
        style={{ opacity: hasChildren ? '1' : '0' }}
      >
        {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
      </IconButton>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText className={styles.list_item_title} primary={node.title} />
      <BookmarkMenu node={node} nodeType={isRoot ? 'root_folder' : 'folder'} />
    </ListItem>
  );
}

function NodeLink({ node, isOver }: BookmarkProps): JSX.Element {
  const styles = useStyles();

  return (
    <>
      {isOver && <div className={styles.over_link_divider} />}
      <ListItem button disableGutters className={styles.list_item}>
        {/* <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} /> */}
        <StyledAvatar node={node} />
        <ListItemText
          className={styles.list_item_title}
          primary={node.title}
          secondary={
            node.url ? (
              <Typography noWrap variant="subtitle2">
                <Link href={node.url} target="_blank" rel="noreferrer" color="inherit">
                  {node.url}
                </Link>
              </Typography>
            ) : null
          }
        />
        <BookmarkMenu node={node} nodeType="link" />
      </ListItem>
    </>
  );
}

interface BookmarkMenuProps {
  node: chrome.bookmarks.BookmarkTreeNode;
  nodeType: 'root_folder' | 'folder' | 'link';
}

function BookmarkMenu({ node, nodeType }: BookmarkMenuProps) {
  const handleOpenNodeModal = useCallback(
    (mode, type) => {
      const nodeToUpdate = mode === 'update' || mode === 'delete' ? node : undefined;
      store.dispatch(
        setNodeDialog({ isOpen: true, mode, type, parentId: node.id, node: nodeToUpdate }),
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
