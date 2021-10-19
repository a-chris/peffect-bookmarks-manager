import Avatar from '@mui/material/Avatar';
import React from 'react';
import { NodeProps } from '../../types/interfaces';
import getFavicon from '../../utils/faviconUtils';

const InternalStyledAvatar = (props: NodeProps): JSX.Element => {
  const { node } = props;
  const faviconUrl = getFavicon(true, node.url);

  return (
    <Avatar
      sx={{ width: '1.5rem', height: '1.5rem', mx: 2 }}
      alt={node.title[0]}
      src={faviconUrl}
    />
  );
};

const StyledAvatar = React.memo(InternalStyledAvatar);

export default StyledAvatar;
