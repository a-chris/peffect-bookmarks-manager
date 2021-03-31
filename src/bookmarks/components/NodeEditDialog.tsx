import { Button, DialogActions, DialogContent, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { editNode } from '../../redux/bookmarksSlice';
import store, { RootStore } from '../../redux/store';
import { openEditDialog } from '../../redux/viewSlice';
import { EditOperation } from '../../types/operations';

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

export default function NodeEditDialog(): JSX.Element {
  const styles = useStyles();
  const { isOpen, node } = useSelector((state: RootStore) => state.view.editDialog);

  const [editingData, setEditingData] = useState(EMPTY_EDITING_DATA);

  React.useEffect(() => {
    if (node != null) {
      setEditingData({ title: node.title, url: node.url || '' });
    }
  }, [node]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingData((curr) => ({ ...curr, [name]: value }));
  };

  const handleClose = () => {
    store.dispatch(openEditDialog({ isOpen: false, node: null }));
  };

  const handleSave = () => {
    if (node != null) {
      const changes = { title: editingData.title, url: '' };
      if (node.url) {
        // then this is a link
        changes.url = editingData.url;
      }
      const editOperation = new EditOperation(node, changes);
      store.dispatch(editNode(editOperation));
      handleClose();
    }
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
        {node?.url && (
          <TextField
            label="URL"
            variant="filled"
            className={styles.input_field}
            name="url"
            value={editingData.url}
            onChange={handleChange}
          />
        )}
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
