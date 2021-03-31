import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Bookmarks from './Bookmarks';

ReactDOM.render(
  <Provider store={store}>
    <Bookmarks />
  </Provider>,
  document.getElementById('bookmarks'),
);
