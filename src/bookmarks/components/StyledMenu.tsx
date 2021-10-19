import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import React, { useCallback, useState } from 'react';

interface MenuItemProps {
  text: string;
  onClick: () => void;
  component?: React.ReactNode;
}

interface MenuProps {
  items: MenuItemProps[];
}

export default function StyledMenu({ items }: MenuProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleMenu = useCallback((e) => {
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
      <Tooltip title={'Actions'}>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          size="small"
          onClick={toggleMenu}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
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
