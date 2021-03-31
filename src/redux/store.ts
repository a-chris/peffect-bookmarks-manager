import { combineReducers, createStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import bookmarksSlice, { BookmarksStore } from './bookmarksSlice';
import viewSlice, { ViewStore } from './viewSlice';

/* Required to use Set and Map in redux */
enableMapSet();
export interface RootStore {
  bookmarks: BookmarksStore;
  view: ViewStore;
}

const reducer = combineReducers({
  bookmarks: bookmarksSlice.reducer,
  view: viewSlice.reducer,
});

const store = createStore(reducer);
export default store;
