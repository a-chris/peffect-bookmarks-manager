import Brightness4Icon from '@mui/icons-material/Brightness4';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import IconButton from '@mui/material/IconButton';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import store, { RootStore } from '../../redux/store';
import { toggleTheme } from '../../redux/viewSlice';

export default function ThemeSwitcher(): JSX.Element {
  const { theme } = useSelector((store: RootStore) => store.view);

  const handleToggleTheme = useCallback(() => store.dispatch(toggleTheme()), []);

  return (
    <IconButton onClick={handleToggleTheme}>
      {theme === 'light' ? <Brightness4Icon /> : <BrightnessHighIcon />}
    </IconButton>
  );
}
