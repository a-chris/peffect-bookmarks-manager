import React from 'react';
import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { primary } from '../style/colors';
import Bookmarks from './Bookmarks';

chrome.tabs.query({ active: true, currentWindow: true }, () => {
  ReactDOM.render(
    <Provider store={store}>
      <Bookmarks />
      <MyToaster />
    </Provider>,
    document.getElementById('bookmarks'),
  );
});

function MyToaster() {
  return (
    <Toaster
      toastOptions={{
        duration: 5000,
        success: {
          iconTheme: {
            primary: primary.main,
            secondary: 'white',
          },
        },
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: 'black',
          borderRadius: '4px',
        },
      }}
    />
  );
}
