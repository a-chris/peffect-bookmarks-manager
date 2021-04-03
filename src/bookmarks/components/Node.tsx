import { Link, Tooltip } from '@material-ui/core';
import { indigo, red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import SortIcon from '@material-ui/icons/Sort';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { deleteNode, sortChildren } from '../../redux/bookmarksSlice';
import store, { RootStore } from '../../redux/store';
import { openCreateDialog, openEditDialog, toggleFolderOpen } from '../../redux/viewSlice';
import { BookmarkProps, NodeWithSuffixProps } from '../../types/interfaces';
import { DeleteOperation, SortChildrenOperation } from '../../types/operations';
import { generateUniqueId } from '../../utils/dndUtils';
import Draggable from '../dnd/Draggable';
import Droppable from '../dnd/Droppable';
import StyledAvatar from './StyledAvatar';
import StyledMenu from './StyledMenu';

const useStyles = makeStyles(() =>
  createStyles({
    list_item_dense: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    list_item_text: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
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
  }, [isOpen]);

  const hasChildren = node.children?.length != null && node.children.length > 0;

  return (
    <div>
      <Draggable id={uniqueId}>
        {node.url ? (
          <NodeLink isOver={false} node={node} suffix={suffix} />
        ) : (
          <Droppable id={uniqueId} droppableChildren={(isOver) => <NodeFolder
            node={node}
            suffix={suffix}
            isRoot={isRoot}
            isOpen={isOpen}
            isOver={isOver}
            onOpen={handleOpen}
          />}/>
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
    <ListItem button divider disableGutters selected={isOver} className={styles.list_item_text}>
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
      <ListItemText primary={node.title} />
      <BookmarkMenu node={node} nodeType={isRoot ? 'root_folder' : 'folder'} />
    </ListItem>
  );
}

function NodeLink({ node, isOver }: BookmarkProps): JSX.Element {
  const styles = useStyles();

  return (
    <>
      {isOver && <div className={styles.over_link_divider} />}
      <ListItem button disableGutters className={styles.list_item_dense}>
        {/* <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} /> */}
        <StyledAvatar node={node} />
        <ListItemText
          className={styles.list_item_text}
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
  const handleCreate = useCallback(() => {
    store.dispatch(openCreateDialog({ isOpen: true, parentId: node.id }));
  }, []);

  const handleDelete = useCallback(() => {
    const deleteOperation = new DeleteOperation(node);
    store.dispatch(deleteNode(deleteOperation));
  }, [node]);

  const handleEdit = useCallback(() => {
    store.dispatch(openEditDialog({ isOpen: true, node }));
  }, [node]);

  const handleSortChildren = useCallback(() => {
    const sortChildrenOperation = new SortChildrenOperation(node);
    store.dispatch(sortChildren(sortChildrenOperation));
  }, []);

  const menuItems = useMemo(() => {
    const options = [];
    if (nodeType !== 'root_folder') {
      options.push(
        { text: 'Edit', onClick: handleEdit },
        { text: 'Delete', onClick: handleDelete },
      );
    }
    if (nodeType !== 'link') {
      options.push(
        {
          text: 'Sort children by name',
          onClick: handleSortChildren,
        },
        {
          text: 'Create folder',
          onClick: handleCreate,
        },
      );
    }
    return options;
  }, [node]);

  return (
    <div style={{ display: 'flex' }}>
      {nodeType !== 'link' && (
        <Tooltip title="Sort children">
          <IconButton onClick={handleSortChildren}>
            <SortIcon />
          </IconButton>
        </Tooltip>
      )}
      <StyledMenu items={menuItems} />
    </div>
  );
}
