import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import _ from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { moveNode } from '../../../redux/bookmarksSlice';
import store, { RootStore } from '../../../redux/store';
import { setMoveToDialog } from '../../../redux/viewSlice';
import { MoveOperation } from '../../../types/operations';
import { joinToArray } from '../../../utils/utils';
import BaseDialog from './BaseDialog';

export default function MoveToDialog(): JSX.Element {
  const { flatNodes } = useSelector((state: RootStore) => state.bookmarks);
  const { isOpen, node } = useSelector((state: RootStore) => state.view.moveToDialog);

  const [destinationPath, setDestinationPath] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  console.log('TCL ~ file: MoveToDialog.tsx ~ line 15 ~ destination', destinationPath);

  const filterOptions = () => {
    const children = destinationPath.length > 0 ? _.last(destinationPath)?.children : flatNodes;
    return children?.filter((n) => n.url == undefined) || [];
  };

  const handleChange = (e: unknown, value: chrome.bookmarks.BookmarkTreeNode[]) => {
    console.log(value);
    setDestinationPath(value);
    setAutocompleteOpen(value.length > 0);
  };

  const handleClose = () => {
    store.dispatch(setMoveToDialog({ isOpen: false }));
  };

  const handleConfirm = () => {
    if (node != null) {
      const destinationNode = _.last(destinationPath);
      const destination = { parentId: destinationNode?.id, index: 0 };
      const moveOperation = new MoveOperation(node, destination);
      store.dispatch(moveNode(moveOperation));
      handleClose();
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={handleClose}>
      <DialogTitle>Move bookmark to</DialogTitle>
      <DialogContent>
        <Autocomplete
          multiple
          autoSelect
          // openOnFocus
          filterSelectedOptions
          // alaways open if the user is writing the destination, undefined (no value) otherwise to open it on focus
          open={autocompleteOpen}
          // open
          options={flatNodes}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => (
            <TextField {...params} label="Destination folder" variant="outlined" />
          )}
          renderTags={(value) =>
            joinToArray(
              value.map((opt) => opt.title),
              '/',
            ).map((title, index) => <p key={index}>{title}</p>)
          }
          filterOptions={filterOptions}
          value={destinationPath}
          onChange={handleChange}
          onOpen={() => setAutocompleteOpen(true)}
          onBlur={() => setAutocompleteOpen(false)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="text">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          Move
        </Button>
      </DialogActions>
    </BaseDialog>
  );
}
