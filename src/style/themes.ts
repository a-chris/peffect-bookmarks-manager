import { createTheme } from '@mui/material/styles';
import { primary } from './colors';

// How to override Mui css properties: https://material-ui.com/customization/globals/#css
const commonTheme = {
  components: {
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '1rem',
        },
      },
    },
  },
};

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary,
  },
  components: {
    ...commonTheme.components,
    MuiFormLabel: {
      styleOverrides: {
        focused: {},
        root: {
          color: 'white',
          '&$focused': {
            color: 'white',
            fontWeight: 'bold',
          },
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary,
  },
  ...commonTheme,
});
