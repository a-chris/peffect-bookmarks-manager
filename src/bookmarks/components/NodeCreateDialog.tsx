import { Button, DialogActions, DialogContent, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createNode } from '../../redux/bookmarksSlice';
import store, { RootStore } from '../../redux/store';
import { openCreateDialog } from '../../redux/viewSlice';
import { CreateOperation } from '../../types/operations';

const useStyles = makeStyles(() =>
  createStyles({
    input_container: {
      display: 'flex',
      flexDirection: 'column',
    },
    input_field: {
      marginBottom: '20px',
    },
  }),
);

const EMPTY_EDITING_DATA = { title: '', url: '' };

export default function NodeCreateDialog(): JSX.Element {
  const styles = useStyles();
  const { isOpen, parentId } = useSelector((state: RootStore) => state.view.createDialog);

  const [editingData, setEditingData] = useState(EMPTY_EDITING_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingData((curr) => ({ ...curr, [name]: value }));
  };

  const handleClose = () => {
    store.dispatch(openCreateDialog({ isOpen: false, parentId: '' }));
  };

  const handleSave = () => {
    const createArgs = { parentId, index: 0, title: editingData.title };
    const createOperation = new CreateOperation(createArgs);
    store.dispatch(createNode(createOperation));
    handleClose();
  };

  return (
    <Dialog fullWidth open={isOpen} onClose={handleClose}>
      <DialogTitle>Edit bookmark</DialogTitle>
      <DialogContent className={styles.input_container}>
        <TextField
          label="Title"
          variant="filled"
          className={styles.input_field}
          name="title"
          value={editingData.title}
          onChange={handleChange}
        />
        {/* {node?.url && (
          <TextField
            label="URL"
            variant="filled"
            className={styles.input_field}
            name="url"
            value={editingData.url}
            onChange={handleChange}
          />
        )} */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="text">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
