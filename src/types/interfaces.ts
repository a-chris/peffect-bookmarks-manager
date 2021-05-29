export interface NodeProps {
  node: chrome.bookmarks.BookmarkTreeNode;
  isRoot?: boolean;
}

export interface NodeWithSuffix extends NodeProps {
  suffix: string;
}
export interface NodeDndProps extends NodeWithSuffix {
  isDraggable: boolean;
  isDroppable: boolean;
}

export interface DragWrapperProps {
  id: string;
  isDraggable: boolean;
  children: React.ReactNode;
}
export interface DropWrapperProps {
  id: string;
  isDroppable: boolean;
  droppableChildren: (isOver: boolean) => React.ReactNode;
}
export interface BookmarkProps extends NodeWithSuffix {
  isOpen?: boolean;
  isOver?: boolean;
  onOpen?: () => void;
}
export interface NodeDragOverlayProps {
  node: chrome.bookmarks.BookmarkTreeNode | null;
  isDragging: boolean;
}
