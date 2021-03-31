import { DragObjectWithType } from "react-dnd";

export interface DragNodeWithType extends DragObjectWithType {
  node: chrome.bookmarks.BookmarkTreeNode;
}
