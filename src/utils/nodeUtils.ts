import _ from 'lodash';
import { move } from '../chrome/bookmarks';
import { unboxProxy } from './proxyUtils';

export function moveDeepNode(
  nodes: chrome.bookmarks.BookmarkTreeNode[],
  node: chrome.bookmarks.BookmarkTreeNode,
  destinationNodeId: string,
): void {
  const flatten = flatDeepNode(nodes);

  const currentNode = flatten.find((n) => n.id === node.id);

  // remove from the current parent
  const currentParent = flatten.find((n) => n.id === node.parentId);
  if (currentNode != null) {
    _.remove(currentParent?.children || [], (n) => n.id === node.id);

    // put to the new parent
    currentNode.parentId = destinationNodeId;
    const newParent = flatten.find((n) => n.id === destinationNodeId);
    newParent?.children?.push(currentNode);
  }
}

export function deleteDeepNode(
  nodes: chrome.bookmarks.BookmarkTreeNode[],
  node: chrome.bookmarks.BookmarkTreeNode,
): void {
  const flatten = flatDeepNode(nodes);
  // remove from current parent
  const currentParent = flatten.find((n) => n.id === node.parentId);
  _.remove(currentParent?.children || [], (n) => n.id === node.id);
}

export function flatDeepNode(
  nodes: chrome.bookmarks.BookmarkTreeNode[],
): chrome.bookmarks.BookmarkTreeNode[] {
  const result = [];
  let currentNodes = nodes;
  while (currentNodes.length > 0) {
    result.push(...currentNodes);
    currentNodes = currentNodes.flatMap((n) => n?.children || []);
  }
  return result;
}

export function flatDeepNodeNoProxy(
  nodes: chrome.bookmarks.BookmarkTreeNode[],
): chrome.bookmarks.BookmarkTreeNode[] {
  const result = [];
  let currentNodes = nodes;
  while (currentNodes.length > 0) {
    result.push(...currentNodes);
    currentNodes = currentNodes.flatMap((n) => n?.children || []);
  }

  return result.map(unboxProxy);
}

export function findParentsIds(
  nodes: chrome.bookmarks.BookmarkTreeNode[],
  node: chrome.bookmarks.BookmarkTreeNode,
): string[] {
  const parentsIds = [];
  let currentNode = node;
  while (currentNode?.parentId != null) {
    const parent = nodes.find((n) => n.id === currentNode.parentId);
    if (parent != null) {
      parentsIds.unshift(parent.id);
      currentNode = parent;
    }
  }
  return parentsIds;
}

/**
 * Apply an alphabetical-descent and case insensitive order
 * to this nodes and return the sorted list.
 * Folder has higher priority than links.
 *
 * @param nodes
 * @returns the sorted nodes list
 */
export function sortNodesByName(
  nodes: chrome.bookmarks.BookmarkTreeNode[],
): chrome.bookmarks.BookmarkTreeNode[] {
  const [folders, links] = _.partition(nodes, (n) => n.url == null);
  const sortedFolders = _.sortBy(folders, (n) => n.title.toLowerCase());
  const sortedLinks = _.sortBy(links, (n) => n.title.toLowerCase());
  return [...sortedFolders, ...sortedLinks];
}

/**
 * Apply an alphabetical-descent and case insensitive order
 * to this node and it's children recursively.
 * Folder has higher priority than links.
 *
 * TODO: returns a flat list of the nodes with id and destinationArgs,
 * so that we can put the move(..) method away from here?
 *
 * @param node
 */
export function sortChildrenByNameAndMove(node: chrome.bookmarks.BookmarkTreeNode): void {
  const children = node.children?.map(unboxProxy) || [];
  const sortedChildren = sortNodesByName(children);
  sortedChildren.forEach((child, cIndex) => {
    child.index = cIndex;
    const destinationArgs = { parentId: node.id, index: cIndex };

    // unboxing proxy to access this object fields

    const childObj = unboxProxy(child);

    move(childObj.id, destinationArgs);

    // recursively apply this function to this node's children
    sortChildrenByNameAndMove(child);
  });
}
