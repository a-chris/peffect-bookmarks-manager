import Avatar from '@material-ui/core/Avatar';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';
import { NodeProps } from '../../types/interfaces';
import getFavicon from '../../utils/faviconUtils';

const StyledAvatar = withStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: theme.spacing(2),
      height: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
  }),
)((props: NodeProps & WithStyles) => {
  const { classes, node } = props;
  return <Avatar className={classes.avatar} src={getFavicon(node.url)} />;
});

export default StyledAvatar;
