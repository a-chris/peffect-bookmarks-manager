import { DragOverlay } from '@dnd-kit/core';
import { Chip, createStyles, makeStyles } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import _ from 'lodash';
import React from 'react';
import { NodeDragOverlayProps } from '../../types/interfaces';

const useStyles = makeStyles((theme) =>
  createStyles({
    chip: {
      padding: theme.spacing(2),
    },
  }),
);

export default function DraggedOverlay({ node }: NodeDragOverlayProps): JSX.Element {
  const styles = useStyles();

  const label = _.truncate(node?.title || node?.url || '');

  return (
    <DragOverlay dropAnimation={null}>
      {node ? (
        <Chip
          color="primary"
          className={styles.chip}
          label={label}
          // avatar={node.url && <Avatar src={`chrome://favicon/${node.url}`} />}
          icon={node.url ? undefined : <FolderIcon />}
        />
      ) : null}
    </DragOverlay>
  );
}
