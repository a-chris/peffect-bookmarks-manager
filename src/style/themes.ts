import { createMuiTheme } from '@material-ui/core/styles';
import { primary } from './colors';

// How to override Mui css properties: https://material-ui.com/customization/globals/#css
const commonTheme = {
  overrides: {
    MuiListItemText: {
      primary: {
        fontSize: '1rem',
      },
    },
  },
};

export const darkTheme = createMuiTheme({
  ...commonTheme,
  palette: {
    type: 'dark',
    primary,
  },
  overrides: {
    ...commonTheme.overrides,
    MuiFormLabel: {
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
});

export const lightTheme = createMuiTheme({
  ...commonTheme,
  palette: {
    type: 'light',
    primary,
  },
});
