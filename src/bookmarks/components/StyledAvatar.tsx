import Avatar from '@mui/material/Avatar';
import React from 'react';
import { NodeProps } from '../../types/interfaces';
import getFavicon from '../../utils/faviconUtils';

export default function StyledAvatar(props: NodeProps): JSX.Element {
  const { node } = props;
  const faviconUrl = getFavicon(node.url);

  return <Avatar sx={{ width: '1rem', height: '1rem', mx: 2 }} src={faviconUrl} />;
}
