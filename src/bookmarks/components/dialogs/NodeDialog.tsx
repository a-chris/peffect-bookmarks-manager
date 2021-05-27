import { Button, DialogActions, DialogContent, TextField } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { createNode, deleteNode, editNode } from '../../../redux/bookmarksSlice';
import store, { RootStore } from '../../../redux/store';
import { setNodeDialog } from '../../../redux/viewSlice';
import { CreateOperation, DeleteOperation, EditOperation } from '../../../types/operations';
import log from '../../../utils/log';
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

export default function NodeDialog(): JSX.Element {
  const styles = useStyles();
  const { isOpen, mode, parentId, type, node } = useSelector(
    (state: RootStore) => state.view.nodeDialog,
  );
  console.log(
    'TCL ~ file: NodeDialog.tsx ~ line 30 ~ isOpen, mode, parentId, type, node',
    isOpen,
    mode,
    parentId,
    type,
    node,
  );

  const [inputData, setInputData] = useState(EMPTY_EDITING_DATA);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (mode === 'update' && node != null) {
      setInputData({ title: node.title, url: node.url || '' });
    }
  }, [mode, node]);

  const handleResetState = () => {
    setInputData(EMPTY_EDITING_DATA);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputData((curr) => ({ ...curr, [name]: value }));
  };

  const handleClose = () => {
    store.dispatch(setNodeDialog({ isOpen: false }));
  };

  const handleConfirm = () => {
    if (mode === 'create' && validate()) {
      log('handleConfirm: create');
      const createArgs = { parentId, index: 0, title: inputData.title, url: inputData.url };
      const createOperation = new CreateOperation(createArgs);
      store.dispatch(createNode(createOperation));
      handleClose();
    } else if (mode === 'update' && node != null && validate()) {
      log('handleConfirm: update');
      const changes = { title: inputData.title, url: '' };
      if (node.url) {
        // then this is a link
        changes.url = inputData.url;
      }
      const editOperation = new EditOperation(node, changes);
      store.dispatch(editNode(editOperation));
      handleClose();
    } else if (mode === 'delete' && node != null) {
      log('handleConfirm: delete');
      const deleteOperation = new DeleteOperation(node);
      store.dispatch(deleteNode(deleteOperation));
      handleClose();
    }
  };

  const validate = () => {
    let isValid = false;
    if (type === 'link') {
      if (!inputData.url.startsWith('http://') && !inputData.url.startsWith('https://')) {
        setErrors((curr) => ({ ...curr, url: 'Url must starts with http:// or https://' }));
        isValid = false;
      } else {
        setErrors((curr) => ({ ...curr, url: undefined }));
        isValid = true;
      }
    } else {
      isValid = true;
    }
    console.log('validate: isValid', isValid);
    return isValid;
  };

  const title = useMemo(() => {
    let operation = '';
    switch (mode) {
      case 'update':
        operation = 'Edit';
        break;
      case 'create':
        operation = 'Create new';
        break;
      case 'delete':
        operation = 'Delete';
        break;
      default:
        operation = 'Unknown operation';
        break;
    }
    const nodeType = type === 'folder' ? 'folder' : 'link';
    return `${operation} ${nodeType}`;
  }, []);

  return (
    <BaseDialog isOpen={isOpen} onClose={handleClose} onExited={handleResetState}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={styles.input_container}>
        {mode === 'delete' ? (
          <>Are you sure you want to delete?</>
        ) : mode === 'create' || mode === 'update' ? (
          <>
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
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="text">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </BaseDialog>
  );
}
