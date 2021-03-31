export interface Operation {
  readonly name: string;
  node?: chrome.bookmarks.BookmarkTreeNode;
}

export class CreateOperation implements Operation {
  createArgs: chrome.bookmarks.BookmarkCreateArg;
  name = 'create';

  constructor(createArgs: chrome.bookmarks.BookmarkCreateArg) {
    this.createArgs = createArgs;
  }
}

export class MoveOperation implements Operation {
  node: chrome.bookmarks.BookmarkTreeNode;
  destinationArgs: chrome.bookmarks.BookmarkDestinationArg;
  name = 'move';

  constructor(node: chrome.bookmarks.BookmarkTreeNode, destinationArgs: chrome.bookmarks.BookmarkDestinationArg) {
    this.node = node;
    this.destinationArgs = destinationArgs;
  }
}

export class DeleteOperation implements Operation {
  node: chrome.bookmarks.BookmarkTreeNode;
  name = 'delete';

  constructor(node: chrome.bookmarks.BookmarkTreeNode) {
    this.node = node;
  }
}

export class EditOperation implements Operation {
  node: chrome.bookmarks.BookmarkTreeNode;
  changesArgs: chrome.bookmarks.BookmarkChangesArg;
  name = 'edit';

  constructor(node: chrome.bookmarks.BookmarkTreeNode, changesArgs: chrome.bookmarks.BookmarkChangesArg) {
    this.node = node;
    this.changesArgs = changesArgs;
  }
}

export class SortChildrenOperation implements Operation {
  node: chrome.bookmarks.BookmarkTreeNode;
  name = 'sort_children';

  constructor(node: chrome.bookmarks.BookmarkTreeNode) {
    this.node = node;
  }
}
