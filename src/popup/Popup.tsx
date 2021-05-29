import React, { useEffect } from 'react';
import './Popup.scss';

/* TODO: Not used at the moment */

export default function Popup(): JSX.Element {
  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true });
  }, []);

  return <div className="popupContainer">Hello, world!</div>;
}
