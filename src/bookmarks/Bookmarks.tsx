import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  LayoutMeasuringStrategy,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  List,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { getTree } from '../chrome/bookmarks';
import { moveNode, setTree } from '../redux/bookmarksSlice';
import store, { RootStore } from '../redux/store';
import { restorePreviousTheme } from '../redux/viewSlice';
import { primary } from '../style/colors';
import { darkTheme, lightTheme } from '../style/themes';
import { MoveOperation } from '../types/operations';
import { extractId } from '../utils/dndUtils';
import './Bookmarks.scss';
import MoveToDialog from './components/dialogs/MoveToDialog';
import NodeCrudDialog from './components/dialogs/NodeCrudDialog';
import Node from './components/node/Node';
import ThemeSwitcher from './components/ThemeSwitcher';
import DraggedOverlay from './dnd/DraggedOverlay';

const debouncedGetTree = _.debounce(() => {
  console.warn('getTree called');
  getTree()
    .then((tree) => store.dispatch(setTree(tree)))
    .catch(console.error);
});

export default function Bookmarks(): JSX.Element {
  const { nodes, flatNodes } = useSelector((state: RootStore) => state.bookmarks);
  const { theme } = useSelector((state: RootStore) => state.view);

  const [draggedNode, setDraggedNode] = useState<chrome.bookmarks.BookmarkTreeNode | null>(null);

  useEffect(() => {
    store.dispatch(restorePreviousTheme());

    getTree()
      .then((tree) => store.dispatch(setTree(tree)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    /* TODO: Find a solution, this is called for each children re-sorted */
    chrome.bookmarks.onCreated.addListener((id, newNode) => {
      console.log('chrome.bookmarks.onCreated', id);
      console.log(JSON.stringify(newNode));
      debouncedGetTree();
    });
    chrome.bookmarks.onMoved.addListener((id, moveInfo) => {
      console.log('chrome.bookmarks.onMoved', id);
      console.log(JSON.stringify(moveInfo));
      debouncedGetTree();
    });
    chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
      console.log('chrome.bookmarks.onChanged', id);
      console.log(JSON.stringify(changeInfo));
      debouncedGetTree();
    });
    chrome.bookmarks.onChildrenReordered.addListener((id, reorderInfo) => {
      console.log('chrome.bookmarks.onChildrenReordered', id);
      console.log(JSON.stringify(reorderInfo));
      debouncedGetTree();
    });
    chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
      console.log('chrome.bookmarks.onRemoved', id);
      console.log(JSON.stringify(removeInfo));
      debouncedGetTree();
    });
  }, []);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { delay: 200, tolerance: 50 },
  });

  // TODO: add other sensors
  const sensors = useSensors(mouseSensor);

  function handleDragStart(event: DragStartEvent) {
    const id = extractId(event.active.id);
    const node = flatNodes.find((n) => n.id === id);
    setDraggedNode(node || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setDraggedNode(null);
    if (event.over?.id != null) {
      const dragId = extractId(event.active.id);
      console.log('handleDragEnd: dragId', dragId);
      const dropId = extractId(event.over.id);
      console.log('handleDragEnd: dropId', dropId);
      const dragNode = flatNodes.find((n) => n.id === dragId);
      const dropNode = flatNodes.find((n) => n.id === dropId);

      if (dragNode && dropNode && dragNode !== dropNode) {
        const destination = { parentId: dropNode.id, index: 0 };
        const moveOperation = new MoveOperation(dragNode, destination);
        store.dispatch(moveNode(moveOperation));
      }
    }
  }

  function handleDragCancel() {
    setDraggedNode(null);
  }

  const appBar = useMemo(
    () => (
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flex: '1' }}>
            Peffect Bookmarks Manager
          </Typography>
          <ThemeSwitcher />
        </Toolbar>
      </AppBar>
    ),
    [],
  );

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />

      <NodeCrudDialog />
      <MoveToDialog />

      {appBar}

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        layoutMeasuring={{ strategy: LayoutMeasuringStrategy.Always }}
      >
        <Box className="bookmarks-container">
          <Container className="left-panel">
            <Paper>
              <List dense>
                {nodes[0]?.children?.map((n) => (
                  <Node isRoot isDraggable isDroppable={false} node={n} key={n.id} suffix="L" />
                ))}
              </List>
            </Paper>
          </Container>
          <div className="divider" style={{ backgroundColor: primary.main }} />
          <Container className="right-panel">
            <Paper>
              <List dense>
                {nodes[0]?.children?.map((n) => (
                  <Node isRoot isDraggable={false} isDroppable node={n} key={n.id} suffix="R" />
                ))}
              </List>
            </Paper>
          </Container>
        </Box>

        {createPortal(
          <DraggedOverlay node={draggedNode} isDragging={draggedNode != null} />,
          document.body,
        )}
      </DndContext>
    </ThemeProvider>
  );
}
