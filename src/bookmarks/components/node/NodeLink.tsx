import { Box, Link, ListItemText, Typography } from '@mui/material';
import { indigo, red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import React from 'react';
import { BookmarkProps } from '../../../types/interfaces';
import StyledAvatar from '../StyledAvatar';
import BookmarkMenu from './BookmarkMenu';
import { StyledListItemButton } from './Common';

const InternalNodeLink = ({ node, isOver }: BookmarkProps): JSX.Element => {
  return (
    <>
      {isOver && <Divider />}
      <StyledListItemButton disableGutters>
        {/* <Checkbox color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} /> */}
        <StyledAvatar node={node} />
        <ListItemTitle
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
      </StyledListItemButton>
    </>
  );
};

const NodeLink = React.memo(InternalNodeLink);

export default NodeLink;

export const ListItemTitle = styled(ListItemText)`
  padding-top: 0;
  padding-bottom: 0,
  
  &:hover: {
    color: ${red[300]};
  }
`;

export const Divider = styled(Box)`
  height: 2px;
  background-color: ${indigo[400]};
`;
