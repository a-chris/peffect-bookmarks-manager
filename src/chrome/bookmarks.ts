import nodesJson from '../test/nodes.json';

function isLocalhost() {
  return process.env.NODE_ENV === 'development' && window.location.href.includes('localhost');
}

export function getTree(): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
  return new Promise((resolve, reject) => {
    if (isLocalhost()) {
      resolve(nodesJson);
    } else {
      chrome.bookmarks.getTree(function (rootNode) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        }
        resolve(rootNode);
      });
    }
  });
}

export function get(id: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.get(id, function (BookmarkTreeNode) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(BookmarkTreeNode);
    });
  });
}

// Retrieves part of the Bookmarks hierarchy, starting at the specified node.
export function getSubTree(id: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.getSubTree(id, function (BookmarkTreeNode) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(BookmarkTreeNode);
    });
  });
}

// Creates a bookmark or folder under the specified parentId. If url is NULL or missing, it will be a folder.
export function create(
  bookmark: chrome.bookmarks.BookmarkCreateArg,
): Promise<chrome.bookmarks.BookmarkTreeNode> {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.create(bookmark, function (BookmarkNode) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(BookmarkNode);
    });
  });
}

// Updates the properties of a bookmark or folder.
// Specify only the properties that you want to change; unspecified properties will be left unchanged.
// Note: Currently, only 'title' and 'url' are supported.
export function update(
  id: string,
  bookmark: chrome.bookmarks.BookmarkChangesArg,
): Promise<chrome.bookmarks.BookmarkTreeNode> {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.update(id, bookmark, function (BookmarkNode) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      }
      resolve(BookmarkNode);
    });
  });
}

// Moves the specified BookmarkTreeNode to the provided location.
export function move(
  id: string,
  destination: chrome.bookmarks.BookmarkDestinationArg,
): Promise<chrome.bookmarks.BookmarkTreeNode> {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.move(id, destination, function (BookmarkNode) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(BookmarkNode);
    });
  });
}

// Removes a bookmark or an empty bookmark folder.
export function remove(id: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.remove(id, function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      }
      resolve(true);
    });
  });
}

// Recursively removes a bookmark folder.
export function removeTree(id: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.removeTree(id, function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      }
      resolve(true);
    });
  });
}

// Search
export function search(query: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
  return new Promise((resolve, reject) => {
    chrome.bookmarks.search(query, function (BookmarkTreeNode) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      }
      resolve(BookmarkTreeNode);
    });
  });
}

// Retrieves folders
// export function getFolders() {
//   return new Promise((resolve, reject) => {
//     chrome.bookmarks.getTree(function (rootNode) {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       }
//       const root = rootNode[0].children.map((item) => item);
//       const folders = recurseFolders(root);
//       resolve(folders);
//     });
//   });
// }

// Retrieves the children of the specified BookmarkTreeNode id.
// export function getChildren(id) {
//   return new Promise((resolve, reject) => {
//     chrome.bookmarks.getChildren(id, function (BookmarkTreeNode) {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       }
//       resolve(BookmarkTreeNode);
//     });
//   });
// }

// const recurseFolders = (arr) => {
//   return arr.reduce((accum, current) => {
//     if (current.children) {
//       accum.push({
//         title: current.title,
//         id: current.id,
//         parentId: current.parentId,
//         children: recurseFolders(current.children),
//       });
//     }
//     return accum;
//   }, []);
// };
