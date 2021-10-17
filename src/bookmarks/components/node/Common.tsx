import { ListItemButton } from '@mui/material';
import { styled } from '@mui/material/styles';


export const StyledListItemButton = styled(ListItemButton)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    background-color: inherit;
  }
`;
