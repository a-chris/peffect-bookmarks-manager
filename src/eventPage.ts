chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const isResponseAsync = false;

  if (request) {
    console.log('eventPage');
  }

  return isResponseAsync;
});

/* 
  'eventPage.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file. 
  Add an import, export, or an empty 'export {}' statement to make it a module. 
*/
export {};
