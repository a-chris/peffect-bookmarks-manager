import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import MoveToDialog from '../bookmarks/components/dialogs/MoveToDialog';

export interface ViewStore {
  theme: 'light' | 'dark';
  foldersOpen: Set<string>;
  nodeDialog: NodeDialog;
  moveToDialog: MoveToDialog;
}

interface NodeDialog {
  isOpen: boolean;
  mode?: 'create' | 'update' | 'delete';
  type?: 'folder' | 'link';
  parentId?: string;
  node?: chrome.bookmarks.BookmarkTreeNode;
}

interface MoveToDialog {
  isOpen: boolean;
  node?: chrome.bookmarks.BookmarkTreeNode;
}

interface OpenFolder {
  isOpen: boolean;
  uniqueId: string;
}

const initialState = {
  theme: 'light',
  foldersOpen: new Set(),
  nodeDialog: {
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
      const prevTheme = localStorage.getItem('theme');
      if (prevTheme === 'light' || prevTheme === 'dark') {
        state.theme = prevTheme;
      } else {
        state.theme = 'light';
      }
    },

    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },

    toggleFolderOpen(state, action: PayloadAction<OpenFolder>) {
      console.log('TCL ~ file: viewSlice.ts ~ line 58 ~ action', action);
      if (action.payload.uniqueId != null) {
        if (action.payload.isOpen) state.foldersOpen.add(action.payload.uniqueId);
        else state.foldersOpen.delete(action.payload.uniqueId);
      }
    },

    setNodeDialog(state, action: PayloadAction<NodeDialog>) {
      console.log('TCL ~ file: viewSlice.ts ~ line 66 ~ action', action);
      state.nodeDialog = action.payload;
    },

    setMoveToDialog(state, action: PayloadAction<MoveToDialog>) {
      console.log('TCL ~ file: viewSlice.ts ~ line 66 ~ action', action);
      state.moveToDialog = action.payload;
    },
  },
});

export const {
  restorePreviousTheme,
  toggleTheme,
  setNodeDialog,
  setMoveToDialog,
  toggleFolderOpen,
} = viewSlice.actions;
export default viewSlice;
