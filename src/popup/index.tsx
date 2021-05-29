import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Popup from './Popup';

/* TODO: Not used at the moment */

chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
  ReactDOM.render(<Popup />, document.getElementById('popup'));
});
