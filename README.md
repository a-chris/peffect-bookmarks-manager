# Peffect Bookmarks Manager

Peffect Bookmarks Manager is an extension, written in Typescript and React, for the Google Chrome browser that aims to improve and simplify the bookmarks management inside the browser through a multi-column UI, drag-and-drop and more advanced operations. If you are like me, with thousands of bookmarks collected during many years on the internet, you will love it.

Once installed it will replace the default Chrome bookmarks manager available at `chrome://bookmarks/`.

![screenshot](readme/screenshot.png)

## Features

- Simple UX, minimal UI
- Dark theme (I was tired of losing my eye while renaming tons of bookmarks at 01:00 A.M.)
- UI organized in two column, each one with it's own navigation, that allows us to navigate different folders at the same time and to have a comprehensive vision of the bookmarks.
- Drag-and-drop: the most simple way to manage your bookmarks. Just select a bookmark from the left column and move it into a folder of the right column.
- Some advanced operations suchs as `Sort children` that allows to sort all the bookmarks inside a folder in alphabetical ascending order but keeping the folders at the top of the list, as it happens with the file explorer we use everyday. This actually changes the order of the bookmarks saved in your browser. There is also a **recursive** version.

## TODO

- [ ] Fix most of the performance issues. The other planned features depend on this.
- [ ] Allow drag-and-drop for both bookmarks and folders to from the left column to the right column and viceversa. At the moment we can only **drag** a bookmark from the **left column** and **drop** to the **right column** and we can't move folders due to the number of Droppable and Draggable components which would really degrade performance.
- [ ] Batch operations: each bookmark of the list should have a checkbox to select/unselect it and then we can execute CRUD operation on a batch of bookmarks at the same time. This feature is a must but I need to work on the performance issues before to work on this.

## Known issues

### Performance

Opening multiple heavy nested bookmarks folders make the application unusable. This is much worse during the development and while using Linux machines (this one due to the missing hardware accelleration on my computer, I think)

### Difficult debugging

Redux and React DevTools do not work while running this application in form of browser extension.
A possible workaround is to run it as a React application and debug it at `http://localhost:3000`.
This approach works but I still have to found a solution for the chrome api imports which breaks the app.

## Technical details

### Drang-and-drop library

I started the project by using `react-dnd` library, which is the de-facto standard, but the application were unusable even with a few of bookmarks and folders for each column, so I tried `dndkit` and I felt it was much faster and more customizable than the previous one, of course it is not perfect yet.
