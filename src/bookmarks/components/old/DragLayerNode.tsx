import { Chip, createStyles, makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import _ from 'lodash';
import React from 'react';
import { useDragLayer } from 'react-dnd';

const useStyles = makeStyles((theme) =>
  createStyles({
    chip: {
      padding: theme.spacing(2),
    },
  }),
);

const divStyles = (x = 0, y = 0) =>
  ({
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    transform: `translate(${x}px, ${y}px)`,
  } as React.CSSProperties);

const memoizedGetLabel = _.memoize((node: chrome.bookmarks.BookmarkTreeNode) =>
  _.truncate(node?.title || node?.url),
);

export default function DragLayerNode(): JSX.Element | null {
  const styles = useStyles();

  const { isDragging, item, clientOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    clientOffset: monitor.getClientOffset(),
  }));

  if (!isDragging || clientOffset == null) return null;

  const label = memoizedGetLabel(item.node);

  return (
    <div style={divStyles(clientOffset.x, clientOffset.y)}>
      <Chip
        color="primary"
        className={styles.chip}
        label={label}
        avatar={item.node.url && <Avatar src={`chrome://favicon/${item.node.url}`} />}
        icon={item.node.url ? undefined : <FolderIcon />}
      />
    </div>
  );
}
