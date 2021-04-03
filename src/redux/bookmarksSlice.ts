import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { create, move, remove, removeTree, update } from '../chrome/bookmarks';
import {
  CreateOperation,
  DeleteOperation,
  EditOperation,
  MoveOperation,
  Operation,
  SortChildrenOperation,
} from '../types/operations';
import {
  flatDeepNode,
  flatDeepNodeNoProxy,
  sortChildrenByNameAndMove,
  sortNodeChildrenByName,
} from '../utils/nodeUtils';

export interface BookmarksStore {
  nodes: chrome.bookmarks.BookmarkTreeNode[];
  flatNodes: chrome.bookmarks.BookmarkTreeNode[];
  operationsQueue: Operation[];
}

const initialState = {
  nodes: [],
  flatNodes: [],
  operationsQueue: [],
} as BookmarksStore;

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setTree(state, action: PayloadAction<chrome.bookmarks.BookmarkTreeNode[]>) {
      state.nodes = action.payload;
      state.flatNodes = flatDeepNodeNoProxy(action.payload);
    },

    moveNode(state, action: PayloadAction<MoveOperation>) {
      console.log('moveNode', JSON.stringify(action));
      const { node, destinationArgs } = action.payload;
      if (destinationArgs.parentId != null) {
        // moveDeepNode(state.nodes, node, destinationArgs.parentId);
        // state.operationsQueue.push(action.payload);

        const destinationFolderTitle = state.flatNodes.find(
          (n) => n.id === destinationArgs.parentId,
        )?.title;

        // move the node if the destination folder is different than its current parent folder
        if (node.parentId === destinationArgs.parentId) {
          toast.error(`${node.title} is already in ${destinationFolderTitle}.`);
        } else {
          move(node.id, destinationArgs)
            .then(() => toast.success(`${node.title} moved in ${destinationFolderTitle}.`))
            .catch(() => toast.error(`Error while moving ${node.title}.`));
        }
      }
    },

    createNode(state, action: PayloadAction<CreateOperation>) {
      console.log('createNode', JSON.stringify(action));
      const { createArgs } = action.payload;

      create(createArgs).then(() => {
        toast.success(`${createArgs.title || 'Link'} created.`);
      });
    },

    deleteNode(state, action: PayloadAction<DeleteOperation>) {
      console.log('deleteNode', JSON.stringify(action));
      const { node } = action.payload;

      if (node.url == null) {
        // is a folder
        removeTree(node.id).then(() => {
          toast.success(`${node.title || 'Link'} deleted.`);
        });
      } else {
        // is a link
        remove(node.id).then(() => {
          toast.success(`${node.title || 'Link'} deleted.`);
        });
      }

      // state.operationsQueue.push(action.payload);
      // deleteDeepNode(state.nodes, node);
    },

    editNode(state, action: PayloadAction<EditOperation>) {
      console.log('editNode', JSON.stringify(action));
      const { node, changesArgs } = action.payload;
      const { title, url } = changesArgs;
      const flatNodeList = flatDeepNode(state.nodes);
      const nodeToUpdate = flatNodeList.find((n) => n.id === node.id);
      if (nodeToUpdate != null) {
        nodeToUpdate.title = title || '';
        nodeToUpdate.url = url;
      }

      update(node.id, changesArgs);
      toast.success(`${changesArgs.title || 'Link'} updated.`);

      // state.operationsQueue.push(action.payload);
    },

    sortChildren(state, action: PayloadAction<SortChildrenOperation>) {
      console.log('sortChildren', JSON.stringify(action));
      const { node } = action.payload;

      Promise.all(
        sortNodeChildrenByName(node).map(async (moveOperation) => {
          return await move(moveOperation.node.id, moveOperation.destinationArgs);
        }),
      )
        .then(() => toast.success(`Sorted ${node.title}.`))
        .catch(() => toast.error(`Error while sorting ${node.title}.`));
    },

    recursiveSortChildren(state, action: PayloadAction<SortChildrenOperation>) {
      console.log('recursiveSortChildren', JSON.stringify(action));
      const { node } = action.payload;

      sortChildrenByNameAndMove(node);
      toast.success(`Recursively sorted ${node.title} and all its children.`);
    },

    applyOperations(state) {
      console.log(state.operationsQueue.map((o) => ({ ...o })));
      state.operationsQueue.forEach(async (op) => {
        if (op instanceof EditOperation) {
          await update(op.node.id, op.changesArgs);
        } else if (op instanceof MoveOperation) {
          await move(op.node.id, op.destinationArgs);
        } else if (op instanceof DeleteOperation) {
          await remove(op.node.id);
        }
      });
    },
  },
  extraReducers: {},
});

export const {
  setTree,
  moveNode,
  createNode,
  deleteNode,
  editNode,
  sortChildren,
  recursiveSortChildren,
  applyOperations,
} = bookmarksSlice.actions;
export default bookmarksSlice;
