import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import MoveToDialogData from '../bookmarks/components/dialogs/MoveToDialog';

export interface ViewStore {
  theme: 'light' | 'dark';
  foldersOpen: Set<string>;
  nodeCrudDialog: nodeCrudDialogData;
  moveToDialog: MoveToDialogData;
}

interface nodeCrudDialogData {
  isOpen: boolean;
  mode?: 'create' | 'update' | 'delete';
  type?: 'folder' | 'link';
  parentId?: string;
  node?: chrome.bookmarks.BookmarkTreeNode;
}

interface MoveToDialogData {
  isOpen: boolean;
  node?: chrome.bookmarks.BookmarkTreeNode;
}

interface OpenFolderData {
  isOpen: boolean;
  uniqueId: string;
}

const initialState = {
  theme: 'light',
  foldersOpen: new Set(),
  nodeCrudDialog: {
    isOpen: false,
  },
  moveToDialog: {
    isOpen: false,
  },
} as ViewStore;

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    restorePreviousTheme(state) {
      console.log('restorePreviousTheme');
      const prevTheme = localStorage.getItem('theme');
      if (prevTheme === 'light' || prevTheme === 'dark') {
        state.theme = prevTheme;
      } else {
        state.theme = 'light';
      }
    },

    toggleTheme(state) {
      console.log('toggleTheme');
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },

    toggleFolderOpen(state, action: PayloadAction<OpenFolderData>) {
      console.log('toggleFolderOpen', action);
      if (action.payload.uniqueId != null) {
        if (action.payload.isOpen) state.foldersOpen.add(action.payload.uniqueId);
        else state.foldersOpen.delete(action.payload.uniqueId);
      }
    },

    setNodeCrudDialog(state, action: PayloadAction<nodeCrudDialogData>) {
      console.log('setNodeCrudDialog', action);
      state.nodeCrudDialog = action.payload;
    },

    setMoveToDialog(state, action: PayloadAction<MoveToDialogData>) {
      console.log('setMoveToDialog', action);
      state.moveToDialog = action.payload;
    },
  },
});

export const {
  restorePreviousTheme,
  toggleTheme,
  setNodeCrudDialog,
  setMoveToDialog,
  toggleFolderOpen,
} = viewSlice.actions;
export default viewSlice;
