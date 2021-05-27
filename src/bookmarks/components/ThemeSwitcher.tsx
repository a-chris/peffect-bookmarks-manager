import { IconButton } from '@material-ui/core';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import React from 'react';
import { useSelector } from 'react-redux';
import store, { RootStore } from '../../redux/store';
import { toggleTheme } from '../../redux/viewSlice';

export default function ThemeSwitcher(): JSX.Element {
  const { theme } = useSelector((store: RootStore) => store.view);

  const handleToggleTheme = React.useCallback(() => store.dispatch(toggleTheme()), []);

  return (
    <IconButton onClick={handleToggleTheme}>
      {theme === 'light' ? <Brightness4Icon /> : <BrightnessHighIcon />}
    </IconButton>
  );
}
