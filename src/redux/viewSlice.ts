import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ViewStore {
  theme: 'light' | 'dark';
  foldersOpen: Set<string>;
  editDialog: EditDialog;
  createDialog: CreateDialog;
}

interface EditDialog {
  isOpen: boolean;
  node: chrome.bookmarks.BookmarkTreeNode | null;
}

interface CreateDialog {
  isOpen: boolean;
  parentId: string;
  type?: 'folder' | 'link';
}

interface OpenFolder {
  isOpen: boolean;
  uniqueId: string;
}

const initialState = {
  theme: 'light',
  foldersOpen: new Set(),
  editDialog: {
    isOpen: false,
    node: null,
  },
  createDialog: {
    isOpen: false,
    parentId: '',
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

    openCreateDialog(state, action: PayloadAction<CreateDialog>) {
      console.log('TCL ~ file: viewSlice.ts ~ line 66 ~ action', action);
      state.createDialog = action.payload;
    },

    openEditDialog(state, action: PayloadAction<EditDialog>) {
      console.log('TCL ~ file: viewSlice.ts ~ line 71 ~ action', action);
      state.editDialog.isOpen = action.payload.isOpen;
      state.editDialog.node = action.payload.node || null;
    },
  },
});

export const {
  restorePreviousTheme,
  toggleTheme,
  openCreateDialog,
  openEditDialog,
  toggleFolderOpen,
} = viewSlice.actions;
export default viewSlice;
