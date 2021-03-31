import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';

interface MenuItemProps {
  text: string;
  onClick: () => void;
  component?: React.ReactNode;
}

interface MenuProps {
  items: MenuItemProps[];
}

export default function StyledMenu({ items }: MenuProps): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const toggleMenu = React.useCallback((e) => {
    setAnchorEl((curr) => (curr == null ? e?.currentTarget : null));
  }, []);

  const getHandleClick = (onClick: () => void) => () => {
    // close the menu when an item has been clicked
    toggleMenu(null);
    onClick();
  };

  const isOpen = anchorEl != null;

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={toggleMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        keepMounted
        open={isOpen}
        onClose={toggleMenu}
      >
        {items.map(
          (item, idx) =>
            item.component ?? (
              <MenuItem key={idx} onClick={getHandleClick(item.onClick)}>
                {item.text}
              </MenuItem>
            ),
        )}
      </Menu>
    </div>
  );
}
