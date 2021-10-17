import { DragOverlay } from '@dnd-kit/core';
import FolderIcon from '@mui/icons-material/Folder';
import { Chip } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { NodeDragOverlayProps } from '../../../types/interfaces';

export default function DraggedOverlay({ node }: NodeDragOverlayProps): JSX.Element {
  const label = _.truncate(node?.title || node?.url || '');

  return (
    <DragOverlay dropAnimation={null}>
      {node ? (
        <Chip
          color="primary"
          sx={{ p: 2 }}
          label={label}
          // avatar={node.url && <Avatar src={getFavicon(node.url)} />}
          icon={node.url ? undefined : <FolderIcon />}
        />
      ) : null}
    </DragOverlay>
  );
}
