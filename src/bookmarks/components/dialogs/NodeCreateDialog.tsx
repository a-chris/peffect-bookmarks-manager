import { Button, DialogActions, DialogContent, TextField } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createNode } from '../../../redux/bookmarksSlice';
import store, { RootStore } from '../../../redux/store';
import { openCreateDialog } from '../../../redux/viewSlice';
import { CreateOperation } from '../../../types/operations';
import BaseDialog from './BaseDialog';

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
  const { isOpen, parentId, type } = useSelector((state: RootStore) => state.view.createDialog);

  const [inputData, setInputData] = useState(EMPTY_EDITING_DATA);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((curr) => ({ ...curr, [name]: value }));
  };

  const handleClose = () => {
    store.dispatch(openCreateDialog({ isOpen: false, parentId: '' }));
  };

  const handleSave = () => {
    const createArgs = { parentId, index: 0, title: inputData.title, url: inputData.url };
    const createOperation = new CreateOperation(createArgs);
    if (validate()) {
      store.dispatch(createNode(createOperation));
      handleClose();
    }
  };

  const validate = () => {
    if (!inputData.url.startsWith('http://') && !inputData.url.startsWith('https://')) {
      setErrors((curr) => ({ ...curr, url: 'Url must starts with http:// or https://' }));
      return false;
    } else {
      setErrors((curr) => ({ ...curr, url: undefined }));
      return true;
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={handleClose}>
      <DialogTitle>{`Create new ${type === 'folder' ? 'folder' : 'link'}`}</DialogTitle>
      <DialogContent className={styles.input_container}>
        <TextField
          required
          label="Title"
          variant="filled"
          className={styles.input_field}
          name="title"
          value={inputData.title}
          onChange={handleChange}
        />
        {type === 'link' && (
          <TextField
            required
            label="URL"
            variant="filled"
            className={styles.input_field}
            name="url"
            value={inputData.url}
            onChange={handleChange}
            error={errors.url != null}
            helperText={errors.url}
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
    </BaseDialog>
  );
}
