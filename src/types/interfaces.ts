export interface NodeProps {
  node: chrome.bookmarks.BookmarkTreeNode;
  isRoot?: boolean;
}

export interface NodeWithSuffixProps extends NodeProps {
  suffix: string;
}

export interface DragWrapperProps {
  id: string;
  children: React.ReactNode;
}
export interface DropWrapperProps {
  id: string;
  droppableChildren: (isOver: boolean) => React.ReactNode;
}
export interface BookmarkProps extends NodeWithSuffixProps {
  isOpen?: boolean;
  isOver?: boolean;
  onOpen?: () => void;
}
export interface NodeDragOverlayProps {
  node: chrome.bookmarks.BookmarkTreeNode | null;
  isDragging: boolean;
}
