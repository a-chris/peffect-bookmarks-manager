import List from '@material-ui/core/List';
import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import Node from './Node';

interface VirtualizedNodeListProps {
  nodes: chrome.bookmarks.BookmarkTreeNode[];
  isRoot?: boolean;
}

export default function VirtualizedNodeList({
  nodes,
  isRoot,
}: VirtualizedNodeListProps): JSX.Element {
  return (
    <List dense>
      <Virtuoso
        useWindowScroll
        data={nodes}
        itemContent={(index, node) => <Node isRoot={isRoot} node={node} />}
      />
    </List>
  );
}
