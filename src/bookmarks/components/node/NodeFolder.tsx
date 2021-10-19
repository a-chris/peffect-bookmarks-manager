import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IconButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { BookmarkProps } from '../../../types/interfaces';
import BookmarkMenu from './BookmarkMenu';
import { StyledListItemButton } from './Common';

const InternalNodeFolder = ({
  node,
  isOpen,
  isOver,
  isRoot,
  onOpen,
}: BookmarkProps): JSX.Element => {
  const hasChildren = node.children?.length != null && node.children.length > 0;

  return (
    <StyledListItemButton divider disableGutters selected={isOver}>
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
    </StyledListItemButton>
  );
};

const NodeFolder = React.memo(InternalNodeFolder);

export default NodeFolder;
